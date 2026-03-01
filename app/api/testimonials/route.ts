import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/testimonials')

app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { text: { contains: search, mode: 'insensitive' as const } }] } : {}

        const [data, total] = await Promise.all([
            prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            prisma.testimonial.count({ where }),
        ])
        const totalPages = Math.ceil(total / limit)
        return c.json({ data, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.testimonial.create({
            data: { name: body.name, avatar: body.avatar || null, role: body.role, text: body.text, rating: Number(body.rating) },
        })
        return c.json({ data, status: 'success', message: 'Testimoni berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.testimonial.update({
            where: { id },
            data: { name: body.name, avatar: body.avatar || null, role: body.role, text: body.text, rating: Number(body.rating) },
        })
        return c.json({ data, status: 'success', message: 'Testimoni berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.testimonial.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Testimoni berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
