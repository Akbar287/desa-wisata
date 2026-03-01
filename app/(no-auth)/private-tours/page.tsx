import PrivateTourComponents from '@/components/PrivateTourComponents'
import { Testimonial, Tour } from '@/types/TourType'
import { prisma } from '@/lib/prisma'

export default async function page() {
    const [dbTours, dbTestimonials] = await Promise.all([
        prisma.tour.findMany({
            where: { type: 'PRIVAT' },
            orderBy: { rating: 'desc' },
            include: {
                themes: { include: { theme: { select: { name: true } } } },
                destinations: { include: { destination: { select: { name: true } } } },
                highlights: { orderBy: { order: 'asc' }, select: { text: true } },
            },
        }),
        prisma.testimonial.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: { name: true, avatar: true, role: true, text: true, rating: true },
        }),
    ]);

    const tours: Tour[] = dbTours.map(t => ({
        id: t.id,
        title: t.title,
        type: 'Privat',
        themes: t.themes.map(th => th.theme.name),
        durationDays: t.durationDays,
        price: t.price,
        destinations: t.destinations.map(d => d.destination.name),
        highlights: t.highlights.map(h => h.text),
        image: t.image,
        rating: t.rating,
        reviews: t.reviewCount,
    }));

    const testimonials: Testimonial[] = dbTestimonials.map(t => ({
        name: t.name,
        avatar: t.avatar ?? '/assets/default-avatar-2020-3.jpg',
        role: t.role,
        text: t.text,
        rating: t.rating,
    }));

    const vipPerks = [
        { emoji: '🚐', title: 'Transportasi Privat', desc: 'Antar-jemput dari hotel atau bandara dengan kendaraan premium' },
        { emoji: '👨‍🏫', title: 'Pemandu Eksklusif', desc: 'Pemandu berpengalaman khusus untuk grup Anda, bukan sharing' },
        { emoji: '🍽️', title: 'Kuliner Premium', desc: 'Menu spesial disiapkan chef lokal dengan bahan organik segar' },
        { emoji: '📸', title: 'Dokumentasi Pro', desc: 'Fotografer & videografer profesional merekam momen Anda' },
        { emoji: '⏰', title: 'Jadwal Fleksibel', desc: 'Tentukan sendiri waktu keberangkatan dan ritme perjalanan' },
        { emoji: '🎁', title: 'Souvenir Eksklusif', desc: 'Oleh-oleh handmade khas desa yang tidak dijual di pasaran' },
    ];

    return (
        <PrivateTourComponents tours={tours} testimonials={testimonials} vipPerks={vipPerks} />
    )
}
