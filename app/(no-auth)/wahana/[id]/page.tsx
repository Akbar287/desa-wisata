import { prisma } from '@/lib/prisma';
import WahanaIdComponents from '@/components/WahanaIdComponents';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WahanaDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const wahana = await prisma.wahana.findUnique({
        where: { id: Number(id) },
        include: {
            WahanaGallery: true,
        },
    });

    if (!wahana) {
        notFound();
    }
    const serializedWahana = {
        ...wahana,
        createdAt: wahana.createdAt.toISOString(),
        updatedAt: wahana.updatedAt.toISOString(),
        WahanaGallery: wahana.WahanaGallery.map(g => ({
            ...g,
            createdAt: g.createdAt.toISOString(),
            updatedAt: g.updatedAt.toISOString(),
        }))
    };

    return <WahanaIdComponents wahana={serializedWahana} />;
}
