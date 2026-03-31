type BookingPaidEmailTemplateInput = {
  customerName: string;
  bookingCode: string;
  orderId: string;
  itemName: string;
  totalAmount: number;
  paidAt: Date | string | null;
  refundUrl: string;
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
    timeStyle: "short",
  }).format(date);
}

export function buildBookingPaidEmailTemplate({
  customerName,
  bookingCode,
  orderId,
  itemName,
  totalAmount,
  paidAt,
  refundUrl,
}: BookingPaidEmailTemplateInput): { subject: string; html: string } {
  const safeCustomerName = escapeHtml(customerName);
  const safeBookingCode = escapeHtml(bookingCode);
  const safeOrderId = escapeHtml(orderId);
  const safeItemName = escapeHtml(itemName);
  const safeRefundUrl = escapeHtml(refundUrl);
  const amountText = fmtCurrency(totalAmount);
  const paidAtText = fmtDate(paidAt);

  return {
    subject: `Terima kasih! Pembayaran Anda berhasil (${safeBookingCode})`,
    html: `
<!doctype html>
<html lang="id">
  <body style="margin:0;padding:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#134e33,#1f7a4d);padding:26px 28px;color:#ffffff;">
                <h1 style="margin:0;font-size:24px;line-height:1.2;">Terima kasih dan selamat!</h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.6;opacity:0.92;">
                  Pembayaran Anda telah kami terima. Sampai jumpa di pengalaman wisata terbaik Desa Manud Jaya.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:14px;line-height:1.7;">
                  Halo <strong>${safeCustomerName}</strong>,
                </p>
                <p style="margin:0 0 18px;font-size:14px;line-height:1.7;">
                  Pembayaran booking Anda sudah berhasil diproses. Kami lampirkan PDF bukti pembayaran pada email ini.
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
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Waktu Pembayaran</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${paidAtText}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">Total Pembayaran</td>
                    <td style="padding:12px 14px;font-size:12px;font-weight:800;text-align:right;border-top:1px solid #e5e7eb;color:#166534;">${escapeHtml(amountText)}</td>
                  </tr>
                </table>

                <div style="margin-top:18px;padding:14px 16px;border-radius:10px;background:#fefce8;border:1px solid #fef08a;">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#713f12;">
                    Jika Anda perlu pembatalan/refund, gunakan tautan berikut:
                    <br />
                    <a href="${safeRefundUrl}" style="color:#1d4ed8;text-decoration:underline;word-break:break-all;">${safeRefundUrl}</a>
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid #e5e7eb;background:#fafafa;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#6b7280;">
                  Email ini dikirim otomatis oleh sistem pembayaran Desa Wisata. Mohon tidak membalas email ini.
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
