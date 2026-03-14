import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/wahanas/map-master')

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const lat = Number(body.lat)
        const lng = Number(body.lng)

        if (!body.title || !Number.isFinite(lat) || !Number.isFinite(lng)) {
            return c.json(
                {
                    data: null,
                    status: 'error',
                    message: 'Title, lat, dan lng wajib valid',
                },
                { status: 400 }
            )
        }

        const data = await prisma.maps.create({
            data: {
                title: body.title,
                content: body.content || '',
                image: body.image || '',
                icon: body.icon || '',
                lat,
                lng,
                fasilitas: Boolean(body.fasilitas),
            },
        })

        return c.json(
            { data, status: 'success', message: 'Map berhasil ditambahkan' },
            { status: 201 }
        )
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID wajib' },
            { status: 400 }
        )
    }

    try {
        const body = await c.req.json()
        const lat = Number(body.lat)
        const lng = Number(body.lng)

        if (!body.title || !Number.isFinite(lat) || !Number.isFinite(lng)) {
            return c.json(
                {
                    data: null,
                    status: 'error',
                    message: 'Title, lat, dan lng wajib valid',
                },
                { status: 400 }
            )
        }

        const data = await prisma.maps.update({
            where: { id },
            data: {
                title: body.title,
                content: body.content || '',
                image: body.image || '',
                icon: body.icon || '',
                lat,
                lng,
                fasilitas: Boolean(body.fasilitas),
            },
        })

        return c.json({
            data,
            status: 'success',
            message: 'Map berhasil diperbarui',
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID wajib' },
            { status: 400 }
        )
    }

    try {
        await prisma.maps.delete({ where: { id } })

        return c.json({
            data: null,
            status: 'success',
            message: 'Map berhasil dihapus',
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
export const PUT = handle(app)
export const DELETE = handle(app)
