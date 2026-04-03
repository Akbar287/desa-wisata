type RefundStatusEmailStatus = "APPROVED" | "REJECTED" | "PAID" | "CANCELLED";

type RefundStatusUpdateEmailTemplateInput = {
  customerName: string;
  bookingCode: string;
  orderId: string;
  itemName: string;
  visitDate: Date | string | null;
  refundAmount: number;
  refundPercent: number;
  status: RefundStatusEmailStatus;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(value: Date | string | null): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

function getStatusCopy(status: RefundStatusEmailStatus): {
  subjectPrefix: string;
  headline: string;
  description: string;
  badgeLabel: string;
  badgeColor: string;
} {
  switch (status) {
    case "APPROVED":
      return {
        subjectPrefix: "Refund disetujui",
        headline: "Pengajuan refund Anda telah disetujui",
        description:
          "Tim kami telah menyetujui refund Anda. Proses transfer dana akan segera dilakukan sesuai prosedur operasional.",
        badgeLabel: "Disetujui",
        badgeColor: "#1d4ed8",
      };
    case "REJECTED":
      return {
        subjectPrefix: "Refund ditolak",
        headline: "Pengajuan refund Anda ditolak",
        description:
          "Maaf, pengajuan refund Anda belum dapat diproses. Silakan hubungi tim kami jika membutuhkan klarifikasi lebih lanjut.",
        badgeLabel: "Ditolak",
        badgeColor: "#be123c",
      };
    case "PAID":
      return {
        subjectPrefix: "Refund sudah dibayar",
        headline: "Refund Anda telah dibayarkan",
        description:
          "Dana refund Anda sudah diproses dan dibayarkan. Terima kasih telah menunggu.",
        badgeLabel: "Sudah Dibayar",
        badgeColor: "#047857",
      };
    case "CANCELLED":
      return {
        subjectPrefix: "Refund dibatalkan",
        headline: "Pengajuan refund Anda dibatalkan",
        description:
          "Pengajuan refund Anda telah dibatalkan. Jika ini tidak sesuai, silakan hubungi tim kami.",
        badgeLabel: "Dibatalkan",
        badgeColor: "#52525b",
      };
  }
}

export function buildRefundStatusUpdateEmailTemplate({
  customerName,
  bookingCode,
  orderId,
  itemName,
  visitDate,
  refundAmount,
  refundPercent,
  status,
}: RefundStatusUpdateEmailTemplateInput): { subject: string; html: string } {
  const copy = getStatusCopy(status);
  const safeCustomerName = escapeHtml(customerName);
  const safeBookingCode = escapeHtml(bookingCode);
  const safeOrderId = escapeHtml(orderId);
  const safeItemName = escapeHtml(itemName);

  return {
    subject: `${copy.subjectPrefix} (${safeBookingCode})`,
    html: `
<!doctype html>
<html lang="id">
  <body style="margin:0;padding:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a,#1f2937);padding:26px 28px;color:#ffffff;">
                <h1 style="margin:0;font-size:24px;line-height:1.2;">Update Status Refund</h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.6;opacity:0.92;">
                  ${escapeHtml(copy.headline)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:14px;line-height:1.7;">
                  Halo <strong>${safeCustomerName}</strong>,
                </p>
                <p style="margin:0 0 18px;font-size:14px;line-height:1.7;">
                  ${escapeHtml(copy.description)}
                </p>
                <p style="margin:0 0 16px;">
                  <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${copy.badgeColor};color:#fff;font-size:12px;font-weight:700;">
                    Status: ${escapeHtml(copy.badgeLabel)}
                  </span>
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td style="background:#f9fafb;padding:12px 14px;font-size:12px;color:#6b7280;">Kode Booking</td>
                    <td style="background:#f9fafb;padding:12px 14px;font-size:12px;font-weight:700;text-align:right;">${safeBookingCode}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Order ID</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${safeOrderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Paket</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${safeItemName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Tanggal Kunjungan</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${escapeHtml(fmtDate(visitDate))}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Nilai Refund</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:800;text-align:right;border-top:1px solid #e5e7eb;color:#166534;">${escapeHtml(fmtCurrency(refundAmount))} (${refundPercent}%)</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid #e5e7eb;background:#fafafa;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#6b7280;">
                  Email ini dikirim otomatis oleh sistem Desa Wisata. Mohon tidak membalas email ini.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
