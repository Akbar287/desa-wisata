import { createHash } from "crypto";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prisma } from "@/lib/prisma";
import { sendBookingPaidEmailByPaymentId } from "@/lib/email/BookingPaidEmailService";

type MidtransStatusPayload = {
  order_id?: string;
  transaction_id?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_time?: string;
  settlement_time?: string;
  expiry_time?: string;
  currency?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  va_numbers?: Array<{ bank?: string; va_number?: string }>;
  permata_va_number?: string;
  biller_code?: string;
  bill_key?: string;
  store?: string;
};

const app = new Hono().basePath("/api/bookings");

const MIDTRANS_SERVER_KEY =
  process.env.NEXT_Midtrans_ServerKey ?? process.env.MIDTRANS_SERVER_KEY ?? "";
const MIDTRANS_MERCHANT_ID =
  process.env.MerchantID ?? process.env.MIDTRANS_MERCHANT_ID ?? "";
const MIDTRANS_ENABLED = Boolean(MIDTRANS_SERVER_KEY && MIDTRANS_MERCHANT_ID);
const MIDTRANS_IS_PRODUCTION =
  process.env.MIDTRANS_IS_PRODUCTION === "true" ||
  (!MIDTRANS_SERVER_KEY.startsWith("SB-") && MIDTRANS_SERVER_KEY.length > 0);

const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const MIDTRANS_API_BASE = MIDTRANS_IS_PRODUCTION
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

const MIDTRANS_ENABLED_PAYMENTS = (process.env.MIDTRANS_ENABLED_PAYMENTS ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toMidtransBasicAuth = () =>
  `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`;

const mapMidtransToLegacyPaymentStatus = (
  transactionStatus?: string | null,
  fraudStatus?: string | null,
): "PENDING" | "PAID" | "FAILED" | "CANCELLED" => {
  const tx = (transactionStatus ?? "").toLowerCase();
  const fraud = (fraudStatus ?? "").toLowerCase();

  if (tx === "capture") {
    return fraud === "accept" ? "PAID" : "PENDING";
  }

  if (tx === "settlement") return "PAID";
  if (tx === "pending") return "PENDING";
  if (tx === "deny" || tx === "failure") return "FAILED";
  if (tx === "cancel" || tx === "expire" || tx === "refund") {
    return "CANCELLED";
  }
  return "PENDING";
};

const verifyMidtransSignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
) => {
  const expected = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  return expected === signatureKey;
};

const parseMidtransDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const toReadablePaymentType = (paymentType?: string | null) => {
  if (!paymentType) return "Midtrans";
  return paymentType
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
};

const mapPaymentTypeToLegacyCategory = (
  paymentType?: string | null,
): "BANK" | "WALLET" | "QRIS" => {
  const type = (paymentType ?? "").toLowerCase();
  if (type === "qris") return "QRIS";
  if (
    type.includes("bank") ||
    type.includes("va") ||
    type === "echannel" ||
    type === "cstore"
  ) {
    return "BANK";
  }
  return "WALLET";
};

const inferPaymentMethodName = (
  paymentType?: string | null,
  response?: MidtransStatusPayload | null,
) => {
  const type = (paymentType ?? "").toLowerCase();
  if (type === "bank_transfer") {
    const bank = response?.va_numbers?.[0]?.bank;
    if (bank) return `VA ${bank.toUpperCase()}`;
    if (response?.permata_va_number) return "VA Permata";
    return "Virtual Account";
  }
  if (type === "echannel") return "Mandiri Bill Payment";
  if (type === "qris") return "QRIS";
  if (type === "cstore" && response?.store) {
    return `Convenience Store ${response.store.toUpperCase()}`;
  }
  return toReadablePaymentType(paymentType);
};

function normalizeBookingPaymentForClient(payment: {
  id: number;
  bookingId: number;
  orderId: string;
  grossAmount: unknown;
  transactionStatus: string;
  fraudStatus: string | null;
  settlementTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  paymentType: string | null;
  midtransResponse: unknown;
}) {
  const status = mapMidtransToLegacyPaymentStatus(
    payment.transactionStatus,
    payment.fraudStatus,
  );
  const amount = Number(payment.grossAmount ?? 0);
  const parsedResponse =
    payment.midtransResponse && typeof payment.midtransResponse === "object"
      ? (payment.midtransResponse as MidtransStatusPayload)
      : null;

  return {
    id: payment.id,
    paymentAvailableId: 0,
    bookingId: payment.bookingId,
    amount,
    status,
    referenceCode: payment.orderId,
    proofOfPayment: null,
    paidAt: payment.settlementTime,
    cancelledAt:
      status === "FAILED" || status === "CANCELLED" ? payment.updatedAt : null,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    paymentAvailable: {
      id: 0,
      name: inferPaymentMethodName(payment.paymentType, parsedResponse),
      accountNumber: payment.orderId,
      accountName: "Midtrans",
      image: "",
      description: "Pembayaran melalui Midtrans",
      type: mapPaymentTypeToLegacyCategory(payment.paymentType),
      isActive: true,
    },
    transactionStatus: payment.transactionStatus,
    paymentType: payment.paymentType,
  };
}

async function persistBookingPaymentStatus(
  bookingPaymentId: number,
  bookingId: number,
  payload: MidtransStatusPayload,
) {
  const existingPayment = await prisma.bookingPayment.findUnique({
    where: { id: bookingPaymentId },
    select: { midtransResponse: true },
  });
  const existingAppMeta =
    existingPayment &&
    isRecord(existingPayment.midtransResponse) &&
    isRecord(existingPayment.midtransResponse.__appMeta)
      ? existingPayment.midtransResponse.__appMeta
      : {};

  const updatedBookingPayment = await prisma.bookingPayment.update({
    where: { id: bookingPaymentId },
    data: {
      transactionId: payload.transaction_id ?? undefined,
      paymentType: payload.payment_type ?? undefined,
      transactionStatus: payload.transaction_status?.toLowerCase() ?? "pending",
      fraudStatus: payload.fraud_status ?? undefined,
      transactionTime: parseMidtransDate(payload.transaction_time),
      settlementTime: parseMidtransDate(payload.settlement_time),
      expiryTime: parseMidtransDate(payload.expiry_time),
      grossAmount: payload.gross_amount
        ? Number(payload.gross_amount)
        : undefined,
      currency: payload.currency ?? "IDR",
      midtransResponse: {
        ...(payload as unknown as object),
        __appMeta: existingAppMeta,
      },
    },
  });

  const currentBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });
  const paymentStatus = mapMidtransToLegacyPaymentStatus(
    payload.transaction_status,
    payload.fraud_status,
  );

  if (currentBooking?.status !== "COMPLETED") {
    if (paymentStatus === "PAID") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });
    } else {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PENDING" },
      });
    }
  }

  if (paymentStatus === "PAID") {
    try {
      await sendBookingPaidEmailByPaymentId(updatedBookingPayment.id);
    } catch (mailErr) {
      console.error("Booking paid email send error:", mailErr);
    }
  }

  return updatedBookingPayment;
}

function normalizeAdminOrderStatus(
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
  latestPaymentStatus?: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | null,
  latestRefundStatus?:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PAID"
    | "CANCELLED"
    | null,
): "PENDING" | "PAID" | "CANCELLED" | "COMPLETED" | "REFUND" {
  if (latestRefundStatus === "PAID") return "REFUND";
  if (bookingStatus === "COMPLETED") return "COMPLETED";
  if (latestPaymentStatus === "PAID") return "PAID";
  if (latestPaymentStatus === "FAILED" || latestPaymentStatus === "CANCELLED") {
    return "CANCELLED";
  }
  if (bookingStatus === "CANCELLED") return "CANCELLED";
  return "PENDING";
}

const PENDING_TRANSACTION_STATUSES = ["pending", "authorize", "challenge"];
const PAID_TRANSACTION_STATUSES = ["settlement", "capture"];
const CANCELLED_TRANSACTION_STATUSES = ["deny", "cancel", "expire", "failure"];

async function getMidtransStatus(orderId: string) {
  const statusRes = await fetch(`${MIDTRANS_API_BASE}/${orderId}/status`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: toMidtransBasicAuth(),
    },
  });

  if (!statusRes.ok) {
    const statusErr = await statusRes.text();
    throw new Error(`Midtrans status error: ${statusRes.status} ${statusErr}`);
  }

  const statusPayload = (await statusRes.json()) as MidtransStatusPayload;
  return statusPayload;
}

app.get("/admin/filter-options", async (c) => {
  try {
    const [tours, destinations, wahanas] = await Promise.all([
      prisma.tour.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
      }),
      prisma.destination.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.wahana.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);

    return c.json({
      status: "success",
      data: {
        tours,
        destinations,
        wahanas,
      },
    });
  } catch (err) {
    console.error("Booking admin filter options error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat opsi filter transaksi" },
      500,
    );
  }
});

app.get("/admin", async (c) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(c.req.query("limit")) || 10),
    );
    const search = c.req.query("search")?.trim() || "";
    const visitDate = c.req.query("visitDate")?.trim() || "";
    const entityType = (c.req.query("entityType") || "all").toLowerCase();
    const entityId = Number(c.req.query("entityId")) || 0;
    const statusFilter = (c.req.query("status") || "ALL").toUpperCase();
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    const andClauses: Array<Record<string, unknown>> = [];
    const refundPaidClause = {
      bookingPayments: {
        some: {
          refund: {
            is: {
              status: "PAID" as const,
            },
          },
        },
      },
    };

    if (search) {
      andClauses.push({
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (visitDate) {
      const start = new Date(visitDate);
      if (!Number.isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        andClauses.push({
          startDate: { gte: start, lt: end },
        });
      }
    }

    if (entityType === "tour") {
      andClauses.push({
        tourId: entityId > 0 ? entityId : { not: null },
      });
    } else if (entityType === "destination") {
      andClauses.push({
        destinationId: entityId > 0 ? entityId : { not: null },
      });
    } else if (entityType === "wahana") {
      andClauses.push({
        wahanaId: entityId > 0 ? entityId : { not: null },
      });
    }

    if (statusFilter === "REFUND") {
      andClauses.push(refundPaidClause);
    } else if (statusFilter === "PAID") {
      andClauses.push({
        bookingPayments: {
          some: {
            transactionStatus: { in: PAID_TRANSACTION_STATUSES },
          },
        },
      });
      andClauses.push({ NOT: refundPaidClause });
    } else if (statusFilter === "PENDING") {
      andClauses.push({
        OR: [
          { bookingPayments: { none: {} } },
          {
            bookingPayments: {
              some: {
                transactionStatus: { in: PENDING_TRANSACTION_STATUSES },
              },
            },
          },
        ],
      });
      andClauses.push({ NOT: refundPaidClause });
    } else if (statusFilter === "CANCELLED") {
      andClauses.push({
        OR: [
          {
            bookingPayments: {
              some: {
                transactionStatus: { in: CANCELLED_TRANSACTION_STATUSES },
              },
            },
          },
          { status: "CANCELLED" },
        ],
      });
      andClauses.push({ NOT: refundPaidClause });
    } else if (statusFilter === "COMPLETED") {
      andClauses.push({ status: "COMPLETED" });
      andClauses.push({ NOT: refundPaidClause });
    }

    if (andClauses.length === 1) {
      Object.assign(where, andClauses[0]);
    } else if (andClauses.length > 1) {
      where.AND = andClauses;
    }

    const [rows, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneCode: true,
          phoneNumber: true,
          startDate: true,
          endDate: true,
          adults: true,
          children: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          tourId: true,
          destinationId: true,
          wahanaId: true,
          tour: { select: { id: true, title: true } },
          destination: { select: { id: true, name: true } },
          wahana: { select: { id: true, name: true } },
          bookingPayments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              transactionStatus: true,
              fraudStatus: true,
              orderId: true,
              createdAt: true,
              settlementTime: true,
              refund: {
                select: {
                  status: true,
                },
              },
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const data = rows.map((row) => {
      const latestPayment = row.bookingPayments[0] ?? null;
      const latestPaymentStatus = latestPayment
        ? mapMidtransToLegacyPaymentStatus(
            latestPayment.transactionStatus,
            latestPayment.fraudStatus,
          )
        : null;
      const latestRefundStatus = latestPayment?.refund?.status ?? null;
      const itemType = row.tour
        ? "TOUR"
        : row.destination
          ? "DESTINATION"
          : row.wahana
            ? "WAHANA"
            : "UNKNOWN";
      const itemName =
        row.tour?.title ??
        row.destination?.name ??
        row.wahana?.name ??
        "Tidak diketahui";
      const normalizedStatus = normalizeAdminOrderStatus(
        row.status,
        latestPaymentStatus,
        latestRefundStatus,
      );

      return {
        id: row.id,
        name: `${row.firstName} ${row.lastName}`.trim(),
        email: row.email,
        phone: `${row.phoneCode}${row.phoneNumber}`,
        itemType,
        itemName,
        itemId: row.tour?.id ?? row.destination?.id ?? row.wahana?.id ?? null,
        visitDate: row.startDate,
        visitEndDate: row.endDate,
        adults: row.adults,
        children: row.children,
        totalPeople: row.adults + row.children,
        totalPrice: row.totalPrice,
        bookingStatus: row.status,
        latestPaymentStatus,
        refundStatus: latestRefundStatus,
        latestPaymentRefCode: latestPayment?.orderId ?? null,
        latestPaymentAt: latestPayment?.createdAt ?? null,
        latestPaidAt: latestPayment?.settlementTime ?? null,
        status: normalizedStatus,
        createdAt: row.createdAt,
      };
    });

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
    console.error("Booking admin list error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat daftar transaksi" },
      500,
    );
  }
});

app.get("/admin/:id", async (c) => {
  try {
    const bookingId = Number(c.req.param("id"));
    if (!bookingId) {
      return c.json(
        { status: "error", message: "ID booking tidak valid" },
        400,
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tour: { select: { id: true, title: true } },
        destination: { select: { id: true, name: true } },
        wahana: { select: { id: true, name: true } },
        bookingPayments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            bookingId: true,
            orderId: true,
            grossAmount: true,
            transactionStatus: true,
            fraudStatus: true,
            settlementTime: true,
            createdAt: true,
            updatedAt: true,
            paymentType: true,
            midtransResponse: true,
            refund: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return c.json(
        { status: "error", message: "Booking tidak ditemukan" },
        404,
      );
    }

    const latestPayment = booking.bookingPayments[0] ?? null;
    const latestPaymentStatus = latestPayment
      ? mapMidtransToLegacyPaymentStatus(
          latestPayment.transactionStatus,
          latestPayment.fraudStatus,
        )
      : null;
    const latestRefundStatus = latestPayment?.refund?.status ?? null;
    const normalizedStatus = normalizeAdminOrderStatus(
      booking.status,
      latestPaymentStatus,
      latestRefundStatus,
    );
    const itemType = booking.tour
      ? "TOUR"
      : booking.destination
        ? "DESTINATION"
        : booking.wahana
          ? "WAHANA"
          : "UNKNOWN";
    const itemName =
      booking.tour?.title ??
      booking.destination?.name ??
      booking.wahana?.name ??
      "Tidak diketahui";
    const { bookingPayments, ...bookingRest } = booking;

    return c.json({
      status: "success",
      data: {
        ...bookingRest,
        payments: bookingPayments.map((payment) =>
          normalizeBookingPaymentForClient(payment),
        ),
        itemType,
        itemName,
        totalPeople: booking.adults + booking.children,
        status: normalizedStatus,
        refundStatus: latestRefundStatus,
      },
    });
  } catch (err) {
    console.error("Booking admin detail error:", err);
    return c.json(
      { status: "error", message: "Gagal memuat detail transaksi" },
      500,
    );
  }
});

app.get("/", async (c) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(c.req.query("limit")) || 10));
    const search = c.req.query("search")?.trim() || "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          adults: true,
          children: true,
          createdAt: true,
          tour: { select: { title: true } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

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
    console.error("Booking list error:", err);
    return c.json({ status: "error", message: "Gagal memuat data" }, 500);
  }
});

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const {
      tourId,
      firstName,
      lastName,
      gender,
      birthYear,
      birthMonth,
      birthDay,
      nationality,
      email,
      phoneCode,
      phoneNumber,
      adults,
      children,
      startDate,
      endDate,
      findUs,
      comments,
      totalPrice,
      type,
    } = body;

    if (
      !tourId ||
      !firstName ||
      !lastName ||
      !gender ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      !nationality ||
      !email ||
      !phoneCode ||
      !phoneNumber ||
      !adults ||
      !startDate ||
      !endDate ||
      !findUs ||
      !type
    ) {
      return c.json({ status: "error", message: "Data tidak lengkap" }, 400);
    }

    const birthDate = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay),
    );

    const parseIdDate = (s: string): Date => {
      const months: Record<string, number> = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        mei: 4,
        jun: 5,
        jul: 6,
        agu: 7,
        sep: 8,
        okt: 9,
        nov: 10,
        des: 11,
      };
      const parts = s.trim().split(/\s+/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const mon = months[parts[1].toLowerCase().substring(0, 3)] ?? 0;
        const year = parseInt(parts[2]);
        return new Date(year, mon, day);
      }
      return new Date(s);
    };

    const genderMap: Record<string, string> = {
      male: "MALE",
      female: "FEMALE",
    };

    const bookingData: {
      firstName: string;
      lastName: string;
      gender: "MALE" | "FEMALE";
      birthDate: Date;
      nationality: string;
      email: string;
      phoneCode: string;
      phoneNumber: string;
      adults: number;
      children: number;
      startDate: Date;
      endDate: Date;
      findUs: string;
      comments: string | null;
      acceptTerms: true;
      status: "PENDING";
      totalPrice: number;
      tourId?: number;
      destinationId?: number;
      wahanaId?: number;
    } = {
      firstName,
      lastName,
      gender: genderMap[gender] as "MALE" | "FEMALE",
      birthDate,
      nationality,
      email,
      phoneCode,
      phoneNumber,
      adults: Number(adults),
      children: Number(children ?? 0),
      startDate: parseIdDate(startDate),
      endDate: parseIdDate(endDate),
      findUs,
      comments: comments || null,
      acceptTerms: true,
      status: "PENDING",
      totalPrice: Number(totalPrice ?? 0),
    };

    if (type === "tour") {
      const tour = await prisma.tour.findFirst({
        where: { id: Number(tourId) },
      });
      if (!tour)
        return c.json(
          { status: "error", message: "Tour tidak ditemukan" },
          404,
        );
      bookingData.tourId = tour.id;
    } else if (type === "destinasi") {
      const dest = await prisma.destination.findFirst({
        where: { id: Number(tourId) },
      });
      if (!dest)
        return c.json(
          { status: "error", message: "Destinasi tidak ditemukan" },
          404,
        );
      bookingData.destinationId = dest.id;
    } else if (type === "wahana") {
      const wahana = await prisma.wahana.findFirst({
        where: { id: Number(tourId) },
      });
      if (!wahana)
        return c.json(
          { status: "error", message: "Wahana tidak ditemukan" },
          404,
        );
      bookingData.wahanaId = wahana.id;
    } else {
      return c.json({ status: "error", message: "Type tidak valid" }, 400);
    }

    const booking = await prisma.booking.create({
      data: bookingData,
    });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          phoneCode,
          phoneNumber,
          age: new Date().getFullYear() - birthDate.getFullYear(),
          gender: genderMap[gender] as "MALE" | "FEMALE",
          nationality,
          address: email,
          avatar: "/api/img?id=default.png",
        },
      });

      const role = await prisma.role.findUnique({
        where: { name: "Pengguna" },
      });
      if (role && user) {
        await prisma.userRole.create({
          data: { userId: user.id, roleId: role.id },
        });
      }
    }

    return c.json({
      status: "success",
      message: "Pemesanan berhasil dibuat",
      data: { id: booking.id },
    });
  } catch (err) {
    console.error("Booking error:", err);
    return c.json({ status: "error", message: "Gagal membuat pemesanan" }, 500);
  }
});

app.post("/create-payment", async (c) => {
  try {
    const body = await c.req.json();
    const bookingId = Number(body.bookingId);
    const amount = Number(body.amount);

    if (!bookingId || Number.isNaN(bookingId)) {
      return c.json({ status: "error", message: "Data tidak lengkap" }, 400);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tour: { select: { title: true } },
        destination: { select: { name: true } },
        wahana: { select: { name: true } },
      },
    });

    if (!booking) {
      return c.json(
        { status: "error", message: "Booking tidak ditemukan" },
        404,
      );
    }

    const grossAmount =
      Number.isFinite(amount) && amount > 0
        ? amount
        : Number(booking.totalPrice);
    if (!grossAmount || Number.isNaN(grossAmount)) {
      return c.json(
        { status: "error", message: "Nominal pembayaran tidak valid" },
        400,
      );
    }

    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const bookingCode = `BK-${booking.id}-${uniqueSuffix}`;
    const orderId = `ORD-${booking.id}-${uniqueSuffix}`;

    if (!MIDTRANS_ENABLED) {
      return c.json({
        status: "error",
        message: "Konfigurasi Midtrans belum tersedia",
      });
    }

    const itemName =
      booking.tour?.title ??
      booking.destination?.name ??
      booking.wahana?.name ??
      "Paket Wisata Desa Manud Jaya";

    const origin = c.req.header("origin");
    const callbacks = origin
      ? {
          finish: `${origin}/payments?id=${booking.id}`,
          pending: `${origin}/payments?id=${booking.id}`,
          error: `${origin}/payments?id=${booking.id}`,
        }
      : undefined;

    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: booking.firstName,
        last_name: booking.lastName,
        email: booking.email,
        phone: `${booking.phoneCode}${booking.phoneNumber}`,
      },
      item_details: [
        {
          id: `booking-${booking.id}`,
          price: grossAmount,
          quantity: 1,
          name: itemName.slice(0, 50),
        },
      ],
      enabled_payments:
        MIDTRANS_ENABLED_PAYMENTS.length > 0
          ? MIDTRANS_ENABLED_PAYMENTS
          : undefined,
      callbacks,
    };

    const midtransRes = await fetch(MIDTRANS_SNAP_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: toMidtransBasicAuth(),
      },
      body: JSON.stringify(midtransPayload),
    });

    if (!midtransRes.ok) {
      const errText = await midtransRes.text();
      console.error("Midtrans create transaction error:", errText);
      return c.json(
        { status: "error", message: "Gagal membuat transaksi Midtrans" },
        502,
      );
    }

    const midtransData = (await midtransRes.json()) as {
      token?: string;
      redirect_url?: string;
    };

    const existingPayment = await prisma.bookingPayment.findFirst({
      where: { bookingId: booking.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const paymentData = {
      bookingCode,
      orderId,
      transactionId: null,
      grossAmount,
      currency: "IDR",
      paymentType: null,
      transactionStatus: "pending",
      fraudStatus: null,
      transactionTime: null,
      settlementTime: null,
      expiryTime: null,
      snapToken: midtransData.token ?? null,
      redirectUrl: midtransData.redirect_url ?? null,
      midtransResponse: (midtransData as unknown as object) ?? {},
    };

    const bookingPayment = existingPayment
      ? await prisma.bookingPayment.update({
          where: { id: existingPayment.id },
          data: paymentData,
        })
      : await prisma.bookingPayment.create({
          data: {
            bookingId: booking.id,
            ...paymentData,
          },
        });

    const normalizedPayment = normalizeBookingPaymentForClient(bookingPayment);

    return c.json({
      status: "success",
      message: "Pembayaran dibuat",
      data: {
        payment: normalizedPayment,
        snapToken: midtransData.token ?? null,
        redirectUrl: midtransData.redirect_url ?? null,
      },
    });
  } catch (err) {
    console.error("Create payment error:", err);
    return c.json(
      { status: "error", message: "Gagal membuat pembayaran" },
      500,
    );
  }
});

app.post("/midtrans-status", async (c) => {
  try {
    if (!MIDTRANS_ENABLED) {
      return c.json(
        { status: "error", message: "Konfigurasi Midtrans belum tersedia" },
        500,
      );
    }

    const body = await c.req.json();
    const paymentId = Number(body.paymentId);
    if (!paymentId) {
      return c.json({ status: "error", message: "paymentId wajib diisi" }, 400);
    }

    const payment = await prisma.bookingPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return c.json(
        { status: "error", message: "Payment tidak ditemukan" },
        404,
      );
    }

    const midStatus = await getMidtransStatus(payment.orderId);
    const updatedPayment = await persistBookingPaymentStatus(
      payment.id,
      payment.bookingId,
      midStatus,
    );

    return c.json({
      status: "success",
      message: "Status pembayaran diperbarui",
      data: normalizeBookingPaymentForClient(updatedPayment),
    });
  } catch (err) {
    console.error("Midtrans status sync error:", err);
    return c.json(
      { status: "error", message: "Gagal sinkronisasi status Midtrans" },
      500,
    );
  }
});

app.get("/midtrans-notification", async (c) => {
  return c.json({
    status: "success",
    message:
      "Midtrans notification endpoint is active. Use POST for callbacks.",
  });
});

app.post("/midtrans-notification", async (c) => {
  try {
    if (!MIDTRANS_ENABLED) {
      return c.json(
        { status: "error", message: "Konfigurasi Midtrans belum tersedia" },
        500,
      );
    }

    const payload = (await c.req.json()) as MidtransStatusPayload;
    const orderId = payload.order_id ?? "";
    const statusCode = payload.status_code ?? "";
    const grossAmount = payload.gross_amount ?? "";
    const signatureKey = payload.signature_key ?? "";

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return c.json(
        { status: "error", message: "Payload notifikasi tidak valid" },
        400,
      );
    }

    const isSignatureValid = verifyMidtransSignature(
      orderId,
      statusCode,
      grossAmount,
      signatureKey,
    );

    if (!isSignatureValid) {
      return c.json({ status: "error", message: "Signature tidak valid" }, 401);
    }

    const payment = await prisma.bookingPayment.findFirst({
      where: { orderId },
    });

    if (!payment) {
      return c.json(
        { status: "error", message: "Payment tidak ditemukan" },
        404,
      );
    }

    const updatedPayment = await persistBookingPaymentStatus(
      payment.id,
      payment.bookingId,
      payload,
    );

    return c.json({
      status: "success",
      message: "Notifikasi Midtrans diproses",
      data: normalizeBookingPaymentForClient(updatedPayment),
    });
  } catch (err) {
    console.error("Midtrans notification error:", err);
    return c.json(
      { status: "error", message: "Gagal memproses notifikasi" },
      500,
    );
  }
});

app.post("/confirm-payment", async (c) => {
  return c.json(
    {
      status: "error",
      message:
        "Metode pembayaran manual sudah dinonaktifkan. Gunakan Midtrans.",
    },
    410,
  );
});

const handler = handle(app);

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => handler(req);
export const PUT = (req: Request) => handler(req);
export const DELETE = (req: Request) => handler(req);
