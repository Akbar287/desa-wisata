import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/wahanas/maps')

app.post('/', async (c) => {
    try {
        const { wahanaId, mapIds } = await c.req.json()
        const wahanaIdNum = Number(wahanaId)
        if (!wahanaIdNum) {
            return c.json(
                { data: null, status: 'error', message: 'wahanaId wajib' },
                { status: 400 }
            )
        }

        const uniqueMapIds = Array.isArray(mapIds)
            ? [
                ...new Set(
                    mapIds
                        .map((id: unknown) => Number(id))
                        .filter((id: number) => Number.isFinite(id) && id > 0),
                ),
            ]
            : []

        await prisma.mapsWahana.deleteMany({
            where: { wahanaId: wahanaIdNum },
        })

        if (uniqueMapIds.length > 0) {
            await prisma.mapsWahana.createMany({
                data: uniqueMapIds.map((mapId, index) => ({
                    wahanaId: wahanaIdNum,
                    mapId,
                    order: index,
                })),
            })
        }

        return c.json({
            data: null,
            status: 'success',
            message: 'Relasi peta wahana berhasil diperbarui',
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

export const POST = handle(app)
