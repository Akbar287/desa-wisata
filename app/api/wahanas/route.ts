import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/wahanas')

// GET - List wahanas with pagination & search
app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()

        const where = search
            ? { name: { contains: search, mode: 'insensitive' as const } }
            : {}

        const [data, total] = await Promise.all([
            prisma.wahana.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: { WahanaGallery: true },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.wahana.count({ where }),
        ])

        const totalPages = Math.ceil(total / limit)

        return c.json({
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            status: 'success',
            message: 'Berhasil mengambil data wahana',
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: [], pagination: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// POST - Create new wahana
app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { name, price, description, imageBanner, gallery } = body

        if (!name || isNaN(Number(price)) || !description || !imageBanner) {
            return c.json(
                { data: null, status: 'error', message: 'Semua field wajib diisi' },
                { status: 400 }
            )
        }

        const existing = await prisma.wahana.findUnique({ where: { name } })
        if (existing) {
            return c.json(
                { data: null, status: 'error', message: 'Nama wahana sudah ada' },
                { status: 409 }
            )
        }

        const data = await prisma.wahana.create({
            data: {
                name,
                price: Number(price),
                description,
                imageBanner,
                WahanaGallery: {
                    create: Array.isArray(gallery) ? gallery.map((g: any) => ({
                        image: g.image
                    })) : []
                }
            },
            include: { WahanaGallery: true }
        })

        return c.json({ data, status: 'success', message: 'Wahana berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// PUT - Update wahana
app.put('/', async (c) => {
    const id = c.req.query('_id')

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID wahana wajib diisi' },
            { status: 400 }
        )
    }

    try {
        const body = await c.req.json()
        const { name, price, description, imageBanner, gallery } = body

        if (!name || isNaN(Number(price)) || !description || !imageBanner) {
            return c.json(
                { data: null, status: 'error', message: 'Semua field wajib diisi' },
                { status: 400 }
            )
        }

        const existing = await prisma.wahana.findUnique({
            where: { name, NOT: { id: Number(id) } }
        })
        if (existing) {
            return c.json(
                { data: null, status: 'error', message: 'Nama wahana sudah ada' },
                { status: 409 }
            )
        }

        // To update gallery: we delete existing gallery and recreate them
        // Alternatively, we can use set/create/delete in Prisma if we have ids, but recreating is simpler for arrays of strings

        await prisma.wahanaGallery.deleteMany({
            where: { wahanaId: Number(id) }
        })

        const data = await prisma.wahana.update({
            where: { id: Number(id) },
            data: {
                name,
                price: Number(price),
                description,
                imageBanner,
                WahanaGallery: {
                    create: Array.isArray(gallery) ? gallery.map((g: any) => ({
                        image: g.image
                    })) : []
                }
            },
            include: { WahanaGallery: true }
        })

        return c.json({ data, status: 'success', message: 'Wahana berhasil diperbarui' })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// DELETE - Delete wahana
app.delete('/', async (c) => {
    const id = c.req.query('_id')

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID wahana wajib diisi' },
            { status: 400 }
        )
    }

    try {
        const data = await prisma.wahana.delete({
            where: { id: Number(id) }
        })

        return c.json({ data, status: 'success', message: 'Wahana berhasil dihapus' })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
