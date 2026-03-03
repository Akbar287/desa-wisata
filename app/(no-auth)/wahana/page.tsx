import { prisma } from '@/lib/prisma'
import WahanaComponents from '@/components/WahanaComponents'

export const dynamic = 'force-dynamic'

export default async function WahanaPage() {
    // Fetch wahanas with their gallery
    const wahanas = await prisma.wahana.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            WahanaGallery: true,
        },
    })

    const serializedWahanas = wahanas.map(w => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
        WahanaGallery: w.WahanaGallery.map(g => ({
            ...g,
            createdAt: g.createdAt.toISOString(),
            updatedAt: g.updatedAt.toISOString(),
        }))
    }));

    return <WahanaComponents wahanas={serializedWahanas} />
}
