import GroupTourComponents from '@/components/GroupTourComponents'
import { Testimonial, Tour } from '@/types/TourType'
import { prisma } from '@/lib/prisma'

export default async function page() {
    const [dbTours, dbTestimonials] = await Promise.all([
        prisma.tour.findMany({
            where: { type: 'GRUP' },
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
        type: 'Grup',
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

    const groupPerks = [
        { emoji: '💰', title: 'Harga Lebih Hemat', desc: 'Biaya dibagi rata dengan peserta lain, jadi liburan premium dengan budget yang ramah kantong' },
        { emoji: '🤝', title: 'Teman Baru', desc: 'Bertemu orang-orang baru dari berbagai kota dan latar belakang. Cocok untuk para ekstrovert!' },
        { emoji: '👨‍👩‍👧‍👦', title: 'Cocok untuk Semua', desc: 'Solo traveler, keluarga, sahabat, maupun pasangan — semua bisa ikut dan menikmati' },
        { emoji: '📅', title: 'Jadwal Teratur', desc: 'Trip berangkat sesuai jadwal yang sudah ditentukan, tinggal pilih tanggal yang cocok' },
        { emoji: '🎯', title: 'Itinerari Terencana', desc: 'Tidak perlu pusing menyusun rencana, semua sudah diatur dari A sampai Z oleh tim kami' },
        { emoji: '🛡️', title: 'Aman & Terorganisir', desc: 'Tim pemandu dan koordinator selalu siap memastikan keselamatan dan kenyamanan grup' },
    ];

    return (
        <GroupTourComponents tours={tours} testimonials={testimonials} groupPerks={groupPerks} />
    )
}
