import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/tours/theme-tours')

// GET - List themes with pagination & search
app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { description: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {}

        const [data, total] = await Promise.all([
            prisma.theme.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { tours: true } } },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.theme.count({ where }),
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
            message: 'Berhasil mengambil data tema',
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: [], pagination: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// POST - Create new theme
app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { name, description } = body

        if (!name || !description) {
            return c.json(
                { data: null, status: 'error', message: 'Nama dan deskripsi wajib diisi' },
                { status: 400 }
            )
        }

        const existing = await prisma.theme.findUnique({ where: { name } })
        if (existing) {
            return c.json(
                { data: null, status: 'error', message: 'Nama tema sudah digunakan' },
                { status: 409 }
            )
        }

        const data = await prisma.theme.create({
            data: { name, description },
            include: { _count: { select: { tours: true } } },
        })

        return c.json({ data, status: 'success', message: 'Tema berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// PUT - Update theme
app.put('/', async (c) => {
    const id = c.req.query('_id')

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID tema wajib diisi' },
            { status: 400 }
        )
    }

    try {
        const body = await c.req.json()
        const { name, description } = body

        if (!name || !description) {
            return c.json(
                { data: null, status: 'error', message: 'Nama dan deskripsi wajib diisi' },
                { status: 400 }
            )
        }

        const existing = await prisma.theme.findUnique({
            where: { name, NOT: { id: Number(id) } }
        })
        if (existing) {
            return c.json(
                { data: null, status: 'error', message: 'Nama tema sudah digunakan' },
                { status: 409 }
            )
        }

        const data = await prisma.theme.update({
            where: { id: Number(id) },
            data: { name, description },
            include: { _count: { select: { tours: true } } },
        })

        return c.json({ data, status: 'success', message: 'Tema berhasil diperbarui' })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
        return c.json(
            { data: null, status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})

// DELETE - Delete theme
app.delete('/', async (c) => {
    const id = c.req.query('_id')

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID tema wajib diisi' },
            { status: 400 }
        )
    }

    try {
        const data = await prisma.theme.delete({
            where: { id: Number(id) }
        })

        return c.json({ data, status: 'success', message: 'Tema berhasil dihapus' })
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
