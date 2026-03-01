import TestimonialComponents from '@/components/TestimonialComponents';
import { prisma } from '@/lib/prisma';

const fmtDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function page() {
    const dbTestimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const testimonials = dbTestimonials.map((t) => ({
        id: t.id,
        name: t.name,
        avatar: t.avatar ?? '/assets/default-avatar-2020-3.jpg',
        role: t.role,
        text: t.text,
        rating: t.rating,
        date: fmtDate(t.createdAt),
    }));

    return <TestimonialComponents testimonials={testimonials} perPage={9} />;
}
