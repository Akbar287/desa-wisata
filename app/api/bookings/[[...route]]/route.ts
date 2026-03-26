import { createHash } from "crypto";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prisma } from "@/lib/prisma";

type MidtransStatusPayload = {
  order_id?: string;
  transaction_status?: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
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

const toMidtransBasicAuth = () =>
  `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`;

const mapMidtransToPaymentStatus = (
  transactionStatus?: string,
  fraudStatus?: string,
): "PENDING" | "PAID" | "FAILED" | "CANCELLED" => {
  const tx = (transactionStatus ?? "").toLowerCase();
  const fraud = (fraudStatus ?? "").toLowerCase();

  if (tx === "capture") {
    return fraud === "accept" ? "PAID" : "PENDING";
  }

  if (tx === "settlement") return "PAID";
  if (tx === "pending") return "PENDING";
  if (tx === "deny") return "FAILED";
  if (tx === "cancel" || tx === "expire") return "CANCELLED";
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

async function persistPaymentStatus(
  paymentId: number,
  bookingId: number,
  nextStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED",
) {
  const paymentData: {
    status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
    paidAt?: Date | null;
    cancelledAt?: Date | null;
  } = { status: nextStatus };

  if (nextStatus === "PAID") {
    paymentData.paidAt = new Date();
    paymentData.cancelledAt = null;
  }

  if (nextStatus === "FAILED" || nextStatus === "CANCELLED") {
    paymentData.cancelledAt = new Date();
  }

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: paymentData,
    include: { paymentAvailable: true },
  });

  if (nextStatus === "PAID") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });
  } else if (nextStatus === "FAILED" || nextStatus === "CANCELLED") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PENDING" },
    });
  }

  return payment;
}

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
    const { bookingId, paymentAvailableId, amount } = body;

    if (!bookingId || !paymentAvailableId || !amount) {
      return c.json({ status: "error", message: "Data tidak lengkap" }, 400);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
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

    const check = await prisma.payment.findFirst({
      where: {
        bookingId: Number(bookingId),
        status: "PENDING",
        amount: Number(amount),
      },
    });

    if (check) {
      await prisma.payment.deleteMany({
        where: {
          bookingId: Number(bookingId),
          status: "PENDING",
          amount: Number(amount),
        },
      });
    }

    const refCode = `PAY-${booking.id}-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId: Number(bookingId),
        paymentAvailableId: Number(paymentAvailableId),
        amount: Number(amount),
        status: "PENDING",
        referenceCode: refCode,
      },
      include: { paymentAvailable: true },
    });

    if (!MIDTRANS_ENABLED) {
      return c.json({
        status: "success",
        message: "Pembayaran dibuat (manual)",
        data: { payment },
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
        order_id: refCode,
        gross_amount: Number(amount),
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
          price: Number(amount),
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

    return c.json({
      status: "success",
      message: "Pembayaran dibuat",
      data: {
        payment,
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

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { paymentAvailable: true },
    });

    if (!payment) {
      return c.json(
        { status: "error", message: "Payment tidak ditemukan" },
        404,
      );
    }

    const midStatus = await getMidtransStatus(payment.referenceCode);
    const nextStatus = mapMidtransToPaymentStatus(
      midStatus.transaction_status,
      midStatus.fraud_status,
    );

    const updatedPayment = await persistPaymentStatus(
      payment.id,
      payment.bookingId,
      nextStatus,
    );

    return c.json({
      status: "success",
      message: "Status pembayaran diperbarui",
      data: updatedPayment,
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

    const payment = await prisma.payment.findFirst({
      where: { referenceCode: orderId },
    });

    if (!payment) {
      return c.json(
        { status: "error", message: "Payment tidak ditemukan" },
        404,
      );
    }

    const nextStatus = mapMidtransToPaymentStatus(
      payload.transaction_status,
      payload.fraud_status,
    );

    const updatedPayment = await persistPaymentStatus(
      payment.id,
      payment.bookingId,
      nextStatus,
    );

    return c.json({
      status: "success",
      message: "Notifikasi Midtrans diproses",
      data: updatedPayment,
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
  try {
    const body = await c.req.json();
    const { paymentId, proofOfPayment } = body;

    if (!paymentId || !proofOfPayment) {
      return c.json({ status: "error", message: "Data tidak lengkap" }, 400);
    }

    const payment = await prisma.payment.update({
      where: { id: Number(paymentId) },
      data: {
        proofOfPayment,
        status: "PAID",
        paidAt: new Date(),
      },
      include: { paymentAvailable: true },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    });

    return c.json({
      status: "success",
      message: "Bukti pembayaran berhasil diupload",
      data: payment,
    });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return c.json(
      { status: "error", message: "Gagal mengkonfirmasi pembayaran" },
      500,
    );
  }
});

const handler = handle(app);

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => handler(req);
export const PUT = (req: Request) => handler(req);
export const DELETE = (req: Request) => handler(req);
