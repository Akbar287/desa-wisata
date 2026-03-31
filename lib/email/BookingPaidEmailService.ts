import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import {
  buildBookingPaidEmailTemplate,
} from "@/lib/email/templates/BookingPaidTemplate";
import {
  renderBookingPaidReceiptPdf,
} from "@/lib/email/templates/BookingPaidReceiptPdf";
import type { SendBookingPaidEmailResult } from "@/types/EmailTypes";

const DEFAULT_REFUND_BASE_URL = "http://desa-wisata-ui.vercel.app/refund";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isPaidStatus(
  transactionStatus?: string | null,
  fraudStatus?: string | null,
): boolean {
  const tx = (transactionStatus ?? "").toLowerCase();
  const fraud = (fraudStatus ?? "").toLowerCase();
  if (tx === "settlement") return true;
  if (tx === "capture") return fraud === "accept";
  return false;
}

function getTransportConfig() {
  const host = (process.env.SMTP_HOST ?? process.env.MAIL_HOST ?? "").trim();
  const user = (process.env.SMTP_USER ?? process.env.MAIL_USER ?? "").trim();
  const pass = (process.env.SMTP_PASS ?? process.env.MAIL_PASS ?? "").trim();
  const from = (
    process.env.SMTP_FROM ??
    process.env.MAIL_FROM ??
    user
  ).trim();
  const portValue = (
    process.env.SMTP_PORT ??
    process.env.MAIL_PORT ??
    "587"
  ).trim();
  const port = Number(portValue);
  const secure =
    (process.env.SMTP_SECURE ?? process.env.MAIL_SECURE ?? "").trim() ===
      "true" || port === 465;

  if (!host || !user || !pass || !from || !Number.isFinite(port)) {
    throw new Error(
      "SMTP belum lengkap. Pastikan SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM terisi.",
    );
  }

  return { host, user, pass, from, port, secure };
}

function getRefundUrl(bookingCode: string): string {
  const base = (
    process.env.REFUND_BASE_URL ??
    process.env.NEXT_PUBLIC_REFUND_BASE_URL ??
    DEFAULT_REFUND_BASE_URL
  ).replace(/\/+$/, "");
  return `${base}/${encodeURIComponent(bookingCode)}`;
}

async function sendBookingPaidEmailByPayment(
  bookingPaymentId: number,
  force = false,
): Promise<SendBookingPaidEmailResult> {
  const payment = await prisma.bookingPayment.findUnique({
    where: { id: bookingPaymentId },
    select: {
      id: true,
      bookingId: true,
      bookingCode: true,
      orderId: true,
      grossAmount: true,
      transactionStatus: true,
      fraudStatus: true,
      settlementTime: true,
      midtransResponse: true,
      booking: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          totalPrice: true,
          tour: { select: { title: true } },
          destination: { select: { name: true } },
          wahana: { select: { name: true } },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("BookingPayment tidak ditemukan.");
  }

  const appMeta = isRecord(payment.midtransResponse)
    ? isRecord(payment.midtransResponse.__appMeta)
      ? payment.midtransResponse.__appMeta
      : {}
    : {};

  if (!force && typeof appMeta.paidConfirmationEmailSentAt === "string") {
    return {
      sent: false,
      skipped: true,
      to: payment.booking.email,
      bookingId: payment.bookingId,
      bookingPaymentId: payment.id,
      bookingCode: payment.bookingCode,
      reason: "EMAIL_ALREADY_SENT",
      messageId:
        typeof appMeta.paidConfirmationEmailMessageId === "string"
          ? appMeta.paidConfirmationEmailMessageId
          : null,
    };
  }

  if (!isPaidStatus(payment.transactionStatus, payment.fraudStatus)) {
    return {
      sent: false,
      skipped: true,
      to: payment.booking.email,
      bookingId: payment.bookingId,
      bookingPaymentId: payment.id,
      bookingCode: payment.bookingCode,
      reason: "PAYMENT_NOT_PAID_YET",
      messageId: null,
    };
  }

  const customerName = `${payment.booking.firstName} ${payment.booking.lastName}`.trim();
  const itemName =
    payment.booking.tour?.title ??
    payment.booking.destination?.name ??
    payment.booking.wahana?.name ??
    "Paket Wisata Desa Manud Jaya";
  const amount = Number(payment.grossAmount ?? payment.booking.totalPrice ?? 0);
  const paidAt = payment.settlementTime;
  const refundUrl = getRefundUrl(payment.bookingCode);

  const { subject, html } = buildBookingPaidEmailTemplate({
    customerName,
    bookingCode: payment.bookingCode,
    orderId: payment.orderId,
    itemName,
    totalAmount: amount,
    paidAt,
    refundUrl,
  });

  const pdfBuffer = await renderBookingPaidReceiptPdf({
    bookingCode: payment.bookingCode,
    orderId: payment.orderId,
    customerName,
    customerEmail: payment.booking.email,
    itemName,
    totalAmount: amount,
    paidAt,
  });

  const config = getTransportConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const mailInfo = await transporter.sendMail({
    from: config.from,
    to: payment.booking.email,
    subject,
    html,
    attachments: [
      {
        filename: `bukti-pembayaran-${payment.bookingCode}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  const previousResponse = isRecord(payment.midtransResponse)
    ? payment.midtransResponse
    : {};
  const previousMeta = isRecord(previousResponse.__appMeta)
    ? previousResponse.__appMeta
    : {};
  const sentAt = new Date().toISOString();

  await prisma.bookingPayment.update({
    where: { id: payment.id },
    data: {
      midtransResponse: {
        ...previousResponse,
        __appMeta: {
          ...previousMeta,
          paidConfirmationEmailSentAt: sentAt,
          paidConfirmationEmailMessageId: mailInfo.messageId ?? null,
          paidConfirmationEmailSentTo: payment.booking.email,
        },
      } as object,
    },
  });

  return {
    sent: true,
    skipped: false,
    to: payment.booking.email,
    bookingId: payment.bookingId,
    bookingPaymentId: payment.id,
    bookingCode: payment.bookingCode,
    messageId: mailInfo.messageId ?? null,
  };
}

export async function sendBookingPaidEmailByPaymentId(
  bookingPaymentId: number,
  force = false,
): Promise<SendBookingPaidEmailResult> {
  return sendBookingPaidEmailByPayment(bookingPaymentId, force);
}

export async function sendBookingPaidEmailByBookingId(
  bookingId: number,
  force = false,
): Promise<SendBookingPaidEmailResult> {
  const latestPayment = await prisma.bookingPayment.findFirst({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!latestPayment) {
    throw new Error("Belum ada data BookingPayment untuk booking ini.");
  }

  return sendBookingPaidEmailByPayment(latestPayment.id, force);
}
