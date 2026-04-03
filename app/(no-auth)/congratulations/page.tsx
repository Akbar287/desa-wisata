import { prisma } from "@/lib/prisma";
import CongratulationComponents from "@/components/CongratulationComponents";
import { notFound } from "next/navigation";

const toIso = (value: Date | string | null | undefined) =>
  value ? new Date(value).toISOString() : null;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const bookingId = Number(id);
  if (!bookingId || isNaN(bookingId)) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: {
        select: {
          id: true,
          title: true,
          durationDays: true,
          price: true,
          image: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          priceWeekday: true,
          priceWeekend: true,
          priceGroup: true,
          imageBanner: true,
        },
      },
      wahana: {
        select: { id: true, name: true, price: true, imageBanner: true },
      },
      bookingPayments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!booking) notFound();

  const mapStatus = (
    transactionStatus?: string | null,
    fraudStatus?: string | null,
  ): "PENDING" | "PAID" | "FAILED" | "CANCELLED" => {
    const tx = (transactionStatus ?? "").toLowerCase();
    const fraud = (fraudStatus ?? "").toLowerCase();
    if (tx === "capture") return fraud === "accept" ? "PAID" : "PENDING";
    if (tx === "settlement") return "PAID";
    if (tx === "pending") return "PENDING";
    if (tx === "deny" || tx === "failure") return "FAILED";
    if (tx === "cancel" || tx === "expire" || tx === "refund")
      return "CANCELLED";
    return "PENDING";
  };
  const mapType = (paymentType?: string | null): "BANK" | "WALLET" | "QRIS" => {
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

  const mappedBooking = {
    id: booking.id,
    tourId: booking.tourId,
    destinationId: booking.destinationId,
    wahanaId: booking.wahanaId,
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phoneCode: booking.phoneCode,
    phoneNumber: booking.phoneNumber,
    adults: booking.adults,
    children: booking.children,
    startDate: toIso(booking.startDate),
    endDate: toIso(booking.endDate),
    totalPrice: booking.totalPrice,
    status: booking.status,
    createdAt: toIso(booking.createdAt),
    tour: booking.tour
      ? {
          id: booking.tour.id,
          title: booking.tour.title,
          durationDays: booking.tour.durationDays,
          price: booking.tour.price,
          image: booking.tour.image,
        }
      : null,
    destination: booking.destination
      ? {
          id: booking.destination.id,
          name: booking.destination.name,
          priceWeekday: booking.destination.priceWeekday,
          priceWeekend: booking.destination.priceWeekend,
          priceGroup: booking.destination.priceGroup,
          imageBanner: booking.destination.imageBanner,
        }
      : null,
    wahana: booking.wahana
      ? {
          id: booking.wahana.id,
          name: booking.wahana.name,
          price: booking.wahana.price,
          imageBanner: booking.wahana.imageBanner,
        }
      : null,
    payments: booking.bookingPayments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.grossAmount ?? 0),
      status: mapStatus(payment.transactionStatus, payment.fraudStatus),
      referenceCode: payment.orderId,
      bookingCode: payment.bookingCode,
      proofOfPayment: null,
      paidAt: toIso(payment.settlementTime),
      createdAt: toIso(payment.createdAt),
      paymentAvailable: {
        id: 0,
        name: "Midtrans",
        type: mapType(payment.paymentType),
        accountNumber: payment.orderId,
        accountName: "Midtrans",
      },
    })),
  };

  return <CongratulationComponents booking={mappedBooking as never} />;
}
