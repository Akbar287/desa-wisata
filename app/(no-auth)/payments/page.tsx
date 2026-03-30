import PaymentComponents from "@/components/PaymentComponents";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const toIso = (value: Date | string | null | undefined) =>
  value ? new Date(value).toISOString() : null;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const bookingId = Number(params.id);
  if (!bookingId || isNaN(bookingId)) notFound();

  const bookingData = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: true,
      destination: true,
      wahana: true,
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
          snapToken: true,
          redirectUrl: true,
        },
      },
    },
  });

  if (!bookingData) notFound();
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
    if (tx === "cancel" || tx === "expire" || tx === "refund") {
      return "CANCELLED";
    }
    return "PENDING";
  };
  const toLegacyType = (
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
  const payments = bookingData.bookingPayments.map((payment) => ({
    id: payment.id,
    paymentAvailableId: 0,
    bookingId: payment.bookingId,
    amount: Number(payment.grossAmount ?? 0),
    status: mapStatus(payment.transactionStatus, payment.fraudStatus),
    referenceCode: payment.orderId,
    proofOfPayment: null,
    paidAt: toIso(payment.settlementTime),
    cancelledAt: null,
    createdAt: toIso(payment.createdAt),
    updatedAt: toIso(payment.updatedAt),
    paymentAvailable: {
      id: 0,
      name: "Midtrans",
      accountNumber: payment.orderId,
      accountName: "Midtrans",
      image: "",
      description: "Pembayaran via Midtrans",
      type: toLegacyType(payment.paymentType),
      isActive: true,
    },
    transactionStatus: payment.transactionStatus,
    paymentType: payment.paymentType,
    snapToken: payment.snapToken,
    redirectUrl: payment.redirectUrl,
  }));
  const normalizedBookingData = {
    id: bookingData.id,
    tourId: bookingData.tourId,
    destinationId: bookingData.destinationId,
    wahanaId: bookingData.wahanaId,
    firstName: bookingData.firstName,
    lastName: bookingData.lastName,
    email: bookingData.email,
    phoneCode: bookingData.phoneCode,
    phoneNumber: bookingData.phoneNumber,
    adults: bookingData.adults,
    children: bookingData.children,
    startDate: toIso(bookingData.startDate),
    endDate: toIso(bookingData.endDate),
    totalPrice: bookingData.totalPrice,
    status: bookingData.status,
    tour: bookingData.tour
      ? {
          id: bookingData.tour.id,
          title: bookingData.tour.title,
          durationDays: bookingData.tour.durationDays,
          price: bookingData.tour.price,
          image: bookingData.tour.image,
        }
      : null,
    destination: bookingData.destination
      ? {
          id: bookingData.destination.id,
          name: bookingData.destination.name,
          priceWeekday: bookingData.destination.priceWeekday,
          priceWeekend: bookingData.destination.priceWeekend,
          priceGroup: bookingData.destination.priceGroup,
          imageBanner: bookingData.destination.imageBanner,
        }
      : null,
    wahana: bookingData.wahana
      ? {
          id: bookingData.wahana.id,
          name: bookingData.wahana.name,
          price: bookingData.wahana.price,
          imageBanner: bookingData.wahana.imageBanner,
        }
      : null,
    payments,
  };
  const paymentMethods = [
    {
      id: 1,
      name: "Midtrans",
      accountNumber: "-",
      accountName: "Midtrans",
      image: "",
      description:
        "Pilih bank transfer, QRIS, e-wallet, atau kartu di Midtrans",
      type: "BANK" as const,
      isActive: true,
    },
  ];

  return (
    <PaymentComponents
      bookingData={normalizedBookingData as never}
      paymentMethods={paymentMethods}
      midtransClientKey={(process.env.NEXT_Midtrans_ClientKey ?? "").trim()}
    />
  );
}
