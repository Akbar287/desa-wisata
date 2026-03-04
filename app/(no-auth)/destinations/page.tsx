import { prisma } from "@/lib/prisma";
import DestinationComponents from '@/components/DestinationComponents'

export default async function DestinationsPage() {
    const [destinations, labels, facilities] = await Promise.all([
        prisma.destination.findMany({
            where: { isAktif: true },
            orderBy: { createdAt: 'desc' },
            include: {
                destinationLabels: { include: { label: { select: { id: true, name: true } } } },
                destinationFacilities: { include: { facility: { select: { id: true, name: true } } } },
                destinationGalleries: { take: 1, orderBy: { createdAt: 'desc' } },
            },
        }),
        prisma.destinationLabel.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
        prisma.destinationFacility.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    ]);

    const serialized = destinations.map(d => ({
        id: d.id,
        name: d.name,
        imageBanner: d.imageBanner,
        description: d.description,
        priceWeekday: d.priceWeekday,
        priceWeekend: d.priceWeekend,
        priceGroup: d.priceGroup,
        minimalGroup: d.minimalGroup,
        jamBuka: d.jamBuka,
        jamTutup: d.jamTutup,
        durasiRekomendasi: d.durasiRekomendasi,
        KuotaHarian: d.KuotaHarian,
        rating: d.rating,
        reviewCount: d.reviewCount,
        labels: d.destinationLabels.map(dl => dl.label.name),
        facilities: d.destinationFacilities.map(df => df.facility.name),
        galleryCount: d.destinationGalleries.length,
    }));

    const labelNames = labels.map(l => l.name);
    const facilityNames = facilities.map(f => f.name);

    return (
        <DestinationComponents
            allDestinations={serialized}
            labels={labelNames}
            facilities={facilityNames}
            itemsPerPage={6}
        />
    );
}
