import RefundComponents from "@/components/RefundComponents";
import { prisma } from "@/lib/prisma";
import {
  REFUND_PERCENTAGE,
  calculateRefundAmount,
  getRefundIneligibilityReason,
  isMidtransPaymentPaid,
  isRefundEligibleBeforeStartDate,
} from "@/lib/refund/refund-utils";
import { notFound } from "next/navigation";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kodeBooking = decodeURIComponent(id || "")
    .trim()
    .toUpperCase();
  if (!kodeBooking) notFound();

  const booking = await prisma.bookingPayment.findUnique({
    where: {
      bookingCode: kodeBooking,
    },
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

  if (!booking) notFound();

  const paidAmount = Number(
    booking.grossAmount ?? booking.booking.totalPrice ?? 0,
  );
  const isPaid = isMidtransPaymentPaid(
    booking.transactionStatus,
    booking.fraudStatus,
  );
  const isBeforeStartDate = isRefundEligibleBeforeStartDate(
    booking.booking.startDate,
  );
  const eligible = isPaid && isBeforeStartDate;
  const ineligibleReason = getRefundIneligibilityReason({
    isPaid,
    isBeforeStartDate,
  });
  const itemName =
    booking.booking.tour?.title ??
    booking.booking.destination?.name ??
    booking.booking.wahana?.name ??
    "Paket Wisata Desa Manud Jaya";

  return (
    <RefundComponents
      initialData={{
        bookingId: booking.booking.id,
        bookingPaymentId: booking.id,
        bookingCode: booking.bookingCode,
        orderId: booking.orderId,
        customerName:
          `${booking.booking.firstName} ${booking.booking.lastName}`.trim(),
        customerEmail: booking.booking.email,
        itemName,
        visitDate: booking.booking.startDate.toISOString(),
        paidAmount,
        refundPercent: REFUND_PERCENTAGE,
        refundAmount: calculateRefundAmount(paidAmount, REFUND_PERCENTAGE),
        eligible,
        ineligibleReason,
        refund: booking.refund
          ? {
              id: booking.refund.id,
              bookingId: booking.refund.bookingId,
              bookingPaymentId: booking.refund.bookingPaymentId,
              bookingCode: booking.refund.bookingCode,
              reason: booking.refund.reason,
              namaBank: booking.refund.namaBank,
              nomorRekening: booking.refund.nomorRekening,
              termsAccepted: booking.refund.termsAccepted,
              refundPercent: booking.refund.refundPercent,
              paidAmount: Number(booking.refund.paidAmount ?? 0),
              refundAmount: Number(booking.refund.refundAmount ?? 0),
              status: booking.refund.status,
              requestedAt: booking.refund.requestedAt.toISOString(),
              processedAt: booking.refund.processedAt
                ? booking.refund.processedAt.toISOString()
                : null,
              createdAt: booking.refund.createdAt.toISOString(),
              updatedAt: booking.refund.updatedAt.toISOString(),
            }
          : null,
      }}
    />
  );
}
