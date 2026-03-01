import TripCalendarComponent from '@/components/TripCalendarComponent'
import { MonthData } from '@/types/TripCalendarType';
import { prisma } from '@/lib/prisma';

const fmtShort = (d: Date) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

const statusMap: Record<string, string> = {
    OPEN: 'Booking dibuka',
    ALMOST_FULL: 'Sisa sedikit kursi',
    FULL: 'Penuh',
    CANCELLED: 'Dibatalkan',
};

export default async function page() {
    const tripMonths = await prisma.tripMonth.findMany({
        orderBy: [{ year: 'asc' }, { id: 'asc' }],
        include: {
            trips: {
                orderBy: { dateStart: 'asc' },
                include: {
                    tour: {
                        select: { id: true, title: true, overview: true }
                    }
                }
            }
        }
    });

    const months: MonthData[] = tripMonths.map(m => ({
        id: m.slug,
        label: m.label,
        year: m.year,
        trips: m.trips.map(t => ({
            dateStart: fmtShort(t.dateStart),
            dateEnd: fmtShort(t.dateEnd),
            tour: t.tour?.title ?? 'Tur Belum Ditentukan',
            tourLink: t.tour ? `/tours/${t.tour.id}` : '#',
            duration: t.duration,
            status: statusMap[t.status] ?? t.status,
            info: t.info ?? t.tour?.overview?.slice(0, 120) ?? '',
        })),
    }));

    return (
        <TripCalendarComponent months={months} />
    )
}
