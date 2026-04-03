import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prisma } from "@/lib/prisma";
import {
  REFUND_PERCENTAGE,
  calculateRefundAmount,
  getRefundIneligibilityReason,
  isMidtransPaymentPaid,
  isRefundEligibleBeforeStartDate,
} from "@/lib/refund/refund-utils";
import { sendRefundStatusEmailByRefundId } from "@/lib/email/RefundStatusEmailService";

const app = new Hono().basePath("/api/refunds");

type RefundStatusValue =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

const STATUS_TRANSITION: Record<RefundStatusValue, RefundStatusValue[]> = {
  REQUESTED: ["REQUESTED", "APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["APPROVED", "PAID", "CANCELLED"],
  REJECTED: ["REJECTED"],
  PAID: ["PAID"],
  CANCELLED: ["CANCELLED"],
};

function normalizeRefund(refund: {
  id: number;
  bookingId: number;
  bookingPaymentId: number;
  bookingCode: string;
  reason: string | null;
  namaBank: string | null;
  nomorRekening: string | null;
  termsAccepted: boolean;
  refundPercent: number;
  paidAmount: unknown;
  refundAmount: unknown;
  status: RefundStatusValue;
  requestedAt: Date;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: refund.id,
    bookingId: refund.bookingId,
    bookingPaymentId: refund.bookingPaymentId,
    bookingCode: refund.bookingCode,
    reason: refund.reason,
    namaBank: refund.namaBank,
    nomorRekening: refund.nomorRekening,
    termsAccepted: refund.termsAccepted,
    refundPercent: refund.refundPercent,
    paidAmount: Number(refund.paidAmount ?? 0),
    refundAmount: Number(refund.refundAmount ?? 0),
    status: refund.status,
    requestedAt: refund.requestedAt,
    processedAt: refund.processedAt,
    createdAt: refund.createdAt,
    updatedAt: refund.updatedAt,
  };
}

function getItemName(booking: {
  tour: { title: string } | null;
  destination: { name: string } | null;
  wahana: { name: string } | null;
}): string {
  return (
    booking.tour?.title ??
    booking.destination?.name ??
    booking.wahana?.name ??
    "Paket Wisata Desa Manud Jaya"
  );
}

app.get("/admin", async (c) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(c.req.query("limit")) || 10),
    );
    const search = c.req.query("search")?.trim() || "";
    const status = (c.req.query("status") || "ALL").toUpperCase();
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    const andClauses: Array<Record<string, unknown>> = [];

    if (search) {
      andClauses.push({
        OR: [
          { bookingCode: { contains: search, mode: "insensitive" } },
          { booking: { firstName: { contains: search, mode: "insensitive" } } },
          { booking: { lastName: { contains: search, mode: "insensitive" } } },
          { booking: { email: { contains: search, mode: "insensitive" } } },
          {
            bookingPayment: {
              orderId: { contains: search, mode: "insensitive" },
            },
          },
        ],
      });
    }

    if (status !== "ALL") {
      andClauses.push({ status });
    }

    if (andClauses.length === 1) {
      Object.assign(where, andClauses[0]);
    } else if (andClauses.length > 1) {
      where.AND = andClauses;
    }

    const [rows, total] = await Promise.all([
      prisma.refund.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedAt: "desc" },
        include: {
          booking: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              startDate: true,
              tour: { select: { title: true } },
              destination: { select: { name: true } },
              wahana: { select: { name: true } },
            },
          },
          bookingPayment: {
            select: {
              id: true,
              orderId: true,
            },
          },
        },
      }),
      prisma.refund.count({ where }),
    ]);

    const data = rows.map((row) => ({
      id: row.id,
      bookingCode: row.bookingCode,
      customerName: `${row.booking.firstName} ${row.booking.lastName}`.trim(),
      customerEmail: row.booking.email,
      itemName: getItemName(row.booking),
      visitDate: row.booking.startDate,
      paidAmount: Number(row.paidAmount ?? 0),
      refundAmount: Number(row.refundAmount ?? 0),
      refundPercent: row.refundPercent,
      status: row.status,
      reason: row.reason,
      requestedAt: row.requestedAt,
      processedAt: row.processedAt,
    }));

    const totalPages = Math.ceil(total / limit);
    return c.json({
      status: "success",
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (err) {
    console.error("Refund admin list error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat daftar refund" },
      500,
    );
  }
});

app.get("/admin/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || Number.isNaN(id)) {
      return c.json({ status: "error", message: "ID refund tidak valid" }, 400);
    }

    const refund = await prisma.refund.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            startDate: true,
            tour: { select: { title: true } },
            destination: { select: { name: true } },
            wahana: { select: { name: true } },
          },
        },
        bookingPayment: {
          select: {
            id: true,
            orderId: true,
          },
        },
      },
    });

    if (!refund) {
      return c.json(
        { status: "error", message: "Data refund tidak ditemukan" },
        404,
      );
    }

    return c.json({
      status: "success",
      data: {
        id: refund.id,
        bookingCode: refund.bookingCode,
        bookingPaymentId: refund.bookingPaymentId,
        customerName:
          `${refund.booking.firstName} ${refund.booking.lastName}`.trim(),
        customerEmail: refund.booking.email,
        itemName: getItemName(refund.booking),
        visitDate: refund.booking.startDate,
        orderId: refund.bookingPayment.orderId,
        paidAmount: Number(refund.paidAmount ?? 0),
        refundAmount: Number(refund.refundAmount ?? 0),
        refundPercent: refund.refundPercent,
        status: refund.status,
        namaBank: refund.namaBank,
        nomorRekening: refund.nomorRekening,
        termsAccepted: refund.termsAccepted,
        reason: refund.reason,
        requestedAt: refund.requestedAt,
        processedAt: refund.processedAt,
        createdAt: refund.createdAt,
        updatedAt: refund.updatedAt,
      },
    });
  } catch (err) {
    console.error("Refund admin detail error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat detail refund" },
      500,
    );
  }
});

app.put("/admin/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || Number.isNaN(id)) {
      return c.json({ status: "error", message: "ID refund tidak valid" }, 400);
    }

    const body = await c.req.json();
    const nextStatus = String(
      body.status ?? "",
    ).toUpperCase() as RefundStatusValue;
    const validStatuses: RefundStatusValue[] = [
      "REQUESTED",
      "APPROVED",
      "REJECTED",
      "PAID",
      "CANCELLED",
    ];
    if (!validStatuses.includes(nextStatus)) {
      return c.json(
        { status: "error", message: "Status refund tidak valid" },
        400,
      );
    }

    const existing = await prisma.refund.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            startDate: true,
            tour: { select: { title: true } },
            destination: { select: { name: true } },
            wahana: { select: { name: true } },
          },
        },
        bookingPayment: {
          select: {
            id: true,
            orderId: true,
          },
        },
      },
    });

    if (!existing) {
      return c.json(
        { status: "error", message: "Data refund tidak ditemukan" },
        404,
      );
    }

    const allowedNext = STATUS_TRANSITION[existing.status] ?? [existing.status];
    if (!allowedNext.includes(nextStatus)) {
      return c.json(
        {
          status: "error",
          message: `Status ${existing.status} tidak dapat diubah ke ${nextStatus}.`,
        },
        400,
      );
    }

    const updated = await prisma.refund.update({
      where: { id },
      data: {
        status: nextStatus,
        processedAt: nextStatus === "REQUESTED" ? null : new Date(),
      },
      include: {
        booking: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            startDate: true,
            tour: { select: { title: true } },
            destination: { select: { name: true } },
            wahana: { select: { name: true } },
          },
        },
        bookingPayment: {
          select: {
            id: true,
            orderId: true,
          },
        },
      },
    });

    if (nextStatus === "APPROVED" || nextStatus === "PAID") {
      await prisma.booking.update({
        where: { id: updated.bookingId },
        data: { status: "CANCELLED" },
      });
    }

    const shouldSendStatusEmail =
      nextStatus !== existing.status &&
      (nextStatus === "APPROVED" ||
        nextStatus === "REJECTED" ||
        nextStatus === "PAID" ||
        nextStatus === "CANCELLED");

    if (shouldSendStatusEmail) {
      try {
        await sendRefundStatusEmailByRefundId(updated.id);
      } catch (emailError) {
        console.error(
          "Refund status email error:",
          emailError instanceof Error ? emailError.message : emailError,
        );
      }
    }

    return c.json({
      status: "success",
      message: "Status refund berhasil diperbarui.",
      data: {
        id: updated.id,
        bookingCode: updated.bookingCode,
        bookingPaymentId: updated.bookingPaymentId,
        customerName:
          `${updated.booking.firstName} ${updated.booking.lastName}`.trim(),
        customerEmail: updated.booking.email,
        itemName: getItemName(updated.booking),
        visitDate: updated.booking.startDate,
        orderId: updated.bookingPayment.orderId,
        paidAmount: Number(updated.paidAmount ?? 0),
        refundAmount: Number(updated.refundAmount ?? 0),
        refundPercent: updated.refundPercent,
        status: updated.status,
        namaBank: updated.namaBank,
        nomorRekening: updated.nomorRekening,
        termsAccepted: updated.termsAccepted,
        reason: updated.reason,
        requestedAt: updated.requestedAt,
        processedAt: updated.processedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err) {
    console.error("Refund admin update error:", err);
    return c.json(
      { status: "error", message: "Gagal memperbarui status refund" },
      500,
    );
  }
});

app.get("/:bookingCode", async (c) => {
  try {
    const bookingCode = decodeURIComponent(c.req.param("bookingCode") || "")
      .trim()
      .toUpperCase();
    if (!bookingCode) {
      return c.json(
        { status: "error", message: "Kode booking tidak valid" },
        400,
      );
    }

    const bookingPayment = await prisma.bookingPayment.findUnique({
      where: { bookingCode },
      include: {
        refund: true,
        booking: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            startDate: true,
            totalPrice: true,
            tour: { select: { title: true } },
            destination: { select: { name: true } },
            wahana: { select: { name: true } },
          },
        },
      },
    });

    if (!bookingPayment) {
      return c.json(
        { status: "error", message: "Data booking tidak ditemukan" },
        404,
      );
    }

    const paidAmount = Number(
      bookingPayment.grossAmount ?? bookingPayment.booking.totalPrice ?? 0,
    );
    const isPaid = isMidtransPaymentPaid(
      bookingPayment.transactionStatus,
      bookingPayment.fraudStatus,
    );
    const isBeforeStartDate = isRefundEligibleBeforeStartDate(
      bookingPayment.booking.startDate,
    );
    const eligible = isPaid && isBeforeStartDate;
    const ineligibleReason = getRefundIneligibilityReason({
      isPaid,
      isBeforeStartDate,
    });

    return c.json({
      status: "success",
      data: {
        bookingId: bookingPayment.booking.id,
        bookingPaymentId: bookingPayment.id,
        bookingCode: bookingPayment.bookingCode,
        orderId: bookingPayment.orderId,
        customerName:
          `${bookingPayment.booking.firstName} ${bookingPayment.booking.lastName}`.trim(),
        customerEmail: bookingPayment.booking.email,
        itemName: getItemName(bookingPayment.booking),
        visitDate: bookingPayment.booking.startDate,
        paidAmount,
        refundPercent: REFUND_PERCENTAGE,
        refundAmount: calculateRefundAmount(paidAmount, REFUND_PERCENTAGE),
        eligible,
        ineligibleReason,
        refund: bookingPayment.refund
          ? normalizeRefund(bookingPayment.refund)
          : null,
      },
    });
  } catch (err) {
    console.error("Refund detail error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat data refund" },
      500,
    );
  }
});

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const bookingCode = String(body.bookingCode ?? "")
      .trim()
      .toUpperCase();
    const reason =
      typeof body.reason === "string" && body.reason.trim().length > 0
        ? body.reason.trim()
        : null;
    const namaBank =
      typeof body.namaBank === "string" ? body.namaBank.trim() : "";
    const nomorRekening =
      typeof body.nomorRekening === "string" ? body.nomorRekening.trim() : "";
    const termsAccepted = Boolean(body.termsAccepted);

    if (!bookingCode) {
      return c.json(
        { status: "error", message: "Kode booking wajib diisi" },
        400,
      );
    }

    if (!termsAccepted) {
      return c.json(
        {
          status: "error",
          message: "Anda wajib menyetujui syarat dan ketentuan refund.",
        },
        400,
      );
    }

    if (!namaBank) {
      return c.json(
        { status: "error", message: "Nama bank wajib diisi." },
        400,
      );
    }

    if (!nomorRekening) {
      return c.json(
        { status: "error", message: "Nomor rekening wajib diisi." },
        400,
      );
    }

    const bookingPayment = await prisma.bookingPayment.findUnique({
      where: { bookingCode },
      include: {
        refund: true,
        booking: {
          select: {
            id: true,
            startDate: true,
            totalPrice: true,
          },
        },
      },
    });

    if (!bookingPayment) {
      return c.json(
        { status: "error", message: "Data booking tidak ditemukan" },
        404,
      );
    }

    if (bookingPayment.refund) {
      return c.json(
        {
          status: "error",
          message: "Refund untuk booking ini sudah pernah diajukan.",
          data: { refund: normalizeRefund(bookingPayment.refund) },
        },
        409,
      );
    }

    const paidAmount = Number(
      bookingPayment.grossAmount ?? bookingPayment.booking.totalPrice ?? 0,
    );
    const isPaid = isMidtransPaymentPaid(
      bookingPayment.transactionStatus,
      bookingPayment.fraudStatus,
    );
    const isBeforeStartDate = isRefundEligibleBeforeStartDate(
      bookingPayment.booking.startDate,
    );
    const eligible = isPaid && isBeforeStartDate;

    if (!eligible) {
      return c.json(
        {
          status: "error",
          message:
            getRefundIneligibilityReason({ isPaid, isBeforeStartDate }) ??
            "Refund tidak dapat diproses.",
        },
        400,
      );
    }

    const refundAmount = calculateRefundAmount(paidAmount, REFUND_PERCENTAGE);
    const refund = await prisma.refund.create({
      data: {
        bookingId: bookingPayment.booking.id,
        bookingPaymentId: bookingPayment.id,
        bookingCode,
        reason,
        namaBank,
        nomorRekening,
        termsAccepted: true,
        refundPercent: REFUND_PERCENTAGE,
        paidAmount,
        refundAmount,
        status: "REQUESTED",
      },
    });

    return c.json({
      status: "success",
      message: "Pengajuan refund berhasil dikirim.",
      data: {
        refund: normalizeRefund(refund),
      },
    });
  } catch (err) {
    console.error("Create refund error:", err);
    return c.json({ status: "error", message: "Gagal mengajukan refund" }, 500);
  }
});

const handler = handle(app);

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => handler(req);
export const PUT = (req: Request) => handler(req);
export const DELETE = (req: Request) => handler(req);
