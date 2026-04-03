import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { buildRefundStatusUpdateEmailTemplate } from "@/lib/email/templates/RefundStatusUpdateTemplate";

type RefundStatusEmailStatus = "APPROVED" | "REJECTED" | "PAID" | "CANCELLED";

export type SendRefundStatusEmailResult = {
  sent: boolean;
  skipped: boolean;
  to: string;
  refundId: number;
  bookingCode: string;
  status: string;
  reason?: string;
  messageId?: string | null;
};

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

export async function sendRefundStatusEmailByRefundId(
  refundId: number,
): Promise<SendRefundStatusEmailResult> {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: {
      booking: {
        select: {
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
          orderId: true,
        },
      },
    },
  });

  if (!refund) {
    throw new Error("Data refund tidak ditemukan.");
  }

  const currentStatus = refund.status as string;
  const allowedStatuses: RefundStatusEmailStatus[] = [
    "APPROVED",
    "REJECTED",
    "PAID",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(refund.status as RefundStatusEmailStatus)) {
    return {
      sent: false,
      skipped: true,
      to: refund.booking.email,
      refundId: refund.id,
      bookingCode: refund.bookingCode,
      status: currentStatus,
      reason: "STATUS_NOT_ELIGIBLE_FOR_EMAIL",
      messageId: null,
    };
  }

  const customerName =
    `${refund.booking.firstName} ${refund.booking.lastName}`.trim();
  const itemName = getItemName(refund.booking);
  const { subject, html } = buildRefundStatusUpdateEmailTemplate({
    customerName,
    bookingCode: refund.bookingCode,
    orderId: refund.bookingPayment.orderId,
    itemName,
    visitDate: refund.booking.startDate,
    refundAmount: Number(refund.refundAmount ?? 0),
    refundPercent: refund.refundPercent,
    status: refund.status as RefundStatusEmailStatus,
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

  const info = await transporter.sendMail({
    from: config.from,
    to: refund.booking.email,
    subject,
    html,
  });

  return {
    sent: true,
    skipped: false,
    to: refund.booking.email,
    refundId: refund.id,
    bookingCode: refund.bookingCode,
    status: currentStatus,
    messageId: info.messageId ?? null,
  };
}
