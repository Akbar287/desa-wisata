import { prisma } from "@/lib/prisma";
import CongratulationComponents from '@/components/CongratulationComponents';
import { notFound } from "next/navigation";

export default async function page({ searchParams }: { searchParams: Promise<{ id?: string; }> }) {
    const { id } = await searchParams;
    const bookingId = Number(id);
    if (!bookingId || isNaN(bookingId)) notFound();

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            tour: {
                select: { id: true, title: true, durationDays: true, price: true, image: true }
            },
            payments: {
                include: {
                    paymentAvailable: {
                        select: { id: true, name: true, type: true, accountNumber: true, accountName: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
        },
    });

    if (!booking) notFound();

    return (
        <CongratulationComponents booking={booking as never} />
    )
}
