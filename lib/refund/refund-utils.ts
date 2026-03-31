export const REFUND_PERCENTAGE = 75;

export function isMidtransPaymentPaid(
  transactionStatus?: string | null,
  fraudStatus?: string | null,
): boolean {
  const tx = (transactionStatus ?? "").toLowerCase();
  const fraud = (fraudStatus ?? "").toLowerCase();
  if (tx === "settlement") return true;
  if (tx === "capture") return fraud === "accept";
  return false;
}

export function isRefundEligibleBeforeStartDate(
  startDate: Date | string,
  now = new Date(),
): boolean {
  const visit = new Date(startDate);
  if (Number.isNaN(visit.getTime())) return false;

  const todayDateOnly = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const visitDateOnly = new Date(
    visit.getFullYear(),
    visit.getMonth(),
    visit.getDate(),
  );

  return todayDateOnly < visitDateOnly;
}

export function calculateRefundAmount(
  paidAmount: number,
  refundPercentage = REFUND_PERCENTAGE,
): number {
  const safeAmount = Number.isFinite(paidAmount) ? paidAmount : 0;
  return Math.round((safeAmount * refundPercentage) / 100);
}

export function getRefundIneligibilityReason({
  isPaid,
  isBeforeStartDate,
}: {
  isPaid: boolean;
  isBeforeStartDate: boolean;
}): string | null {
  if (!isPaid) {
    return "Refund hanya dapat diajukan untuk pembayaran yang sudah lunas.";
  }
  if (!isBeforeStartDate) {
    return "Refund tidak dapat diajukan pada tanggal kunjungan atau setelah tanggal kunjungan.";
  }
  return null;
}
