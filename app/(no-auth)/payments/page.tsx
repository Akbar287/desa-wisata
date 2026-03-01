import PaymentComponents from "@/components/PaymentComponents";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const params = await searchParams;
    const bookingId = Number(params.id);
    if (!bookingId || isNaN(bookingId)) notFound();

    const bookingData = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            tour: true,
            payments: { include: { paymentAvailable: true }, orderBy: { createdAt: "desc" } },
        },
    });

    if (!bookingData) notFound();

    const paymentMethods = await prisma.paymentAvailable.findMany({
        where: { isActive: true },
        orderBy: { type: "asc" },
    });

    return (
        <PaymentComponents bookingData={bookingData} paymentMethods={paymentMethods} />
    );
}
