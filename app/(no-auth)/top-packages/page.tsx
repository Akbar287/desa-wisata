import TopPackageComponents from '@/components/TopPackageComponents'
import { SpecialPackage } from '@/types/TourType';
import { prisma } from '@/lib/prisma';

export default async function page() {
    const dbPackages = await prisma.specialPackage.findMany({
        orderBy: { limitedSlots: 'asc' },
        include: {
            tour: {
                include: {
                    highlights: { orderBy: { order: 'asc' }, select: { text: true } },
                },
            },
        },
    });

    const packages: SpecialPackage[] = dbPackages.map(pkg => ({
        id: pkg.tour.id,
        title: pkg.tour.title,
        subtitle: pkg.subtitle,
        image: pkg.tour.image,
        price: pkg.tour.price,
        originalPrice: pkg.originalPrice,
        discount: pkg.discount,
        badge: pkg.badge,
        badgeEmoji: pkg.badgeEmoji,
        gradient: pkg.gradient,
        durationDays: pkg.tour.durationDays,
        groupSize: pkg.groupSize,
        rating: pkg.tour.rating,
        reviews: pkg.tour.reviewCount,
        highlights: pkg.tour.highlights.map(h => h.text),
        season: pkg.season,
        dateRange: pkg.dateRange,
        limitedSlots: pkg.limitedSlots,
    }));

    const seasons = ['Semua', ...new Set(packages.map(p => p.season))];

    return (
        <TopPackageComponents packages={packages} seasons={seasons} />
    )
}
