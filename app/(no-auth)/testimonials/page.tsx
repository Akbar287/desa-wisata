import TestimonialComponents from '@/components/TestimonialComponents';
import { prisma } from '@/lib/prisma';

const fmtDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function page() {
    const dbTestimonials = await prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: {
            Booking: {
                select: {
                    tour: { select: { id: true, title: true } },
                    destination: { select: { id: true, name: true } },
                    wahana: { select: { id: true, name: true } },
                },
            },
            images: {
                select: {
                    id: true,
                    fileName: true,
                },
                orderBy: { id: 'asc' },
            },
        },
    });

    const testimonials = dbTestimonials.map((t) => {
        const entityType: 'destination' | 'wahana' | 'tour' | null = t.Booking.destination
            ? 'destination'
            : t.Booking.wahana
                ? 'wahana'
                : t.Booking.tour
                    ? 'tour'
                    : null;

        const entityName =
            t.Booking.destination?.name ??
            t.Booking.wahana?.name ??
            t.Booking.tour?.title ??
            null;

        const entityHref = t.Booking.destination
            ? `/destinations/${t.Booking.destination.id}`
            : t.Booking.wahana
                ? `/wahana/${t.Booking.wahana.id}`
                : t.Booking.tour
                    ? `/tours/${t.Booking.tour.id}`
                    : null;

        return {
            entityType,
            entityName,
            entityHref,
            id: t.id,
            name: t.name,
            avatar: t.avatar ?? '/assets/default-avatar-2020-3.jpg',
            role: t.role,
            text: t.text,
            rating: t.rating,
            date: fmtDate(t.createdAt),
            createdAt: t.createdAt.toISOString(),
            images: t.images.map((img) => ({
                id: img.id,
                fileName: img.fileName,
                url: `/api/testimonials/images/${img.id}`,
            })),
        };
    });

    return <TestimonialComponents testimonials={testimonials} perPage={9} />;
}
