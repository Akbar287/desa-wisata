import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/wahanas/ref')

app.get('/', async (c) => {
    try {
        const maps = await prisma.maps.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                icon: true,
                lat: true,
                lng: true,
                fasilitas: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return c.json({
            data: { maps },
            status: 'success',
            message: 'OK',
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

export const GET = handle(app)
