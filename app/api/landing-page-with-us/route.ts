import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/landing-page-with-us')

app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { subtitle: { contains: search, mode: 'insensitive' as const } }] } : {}

        const [data, total] = await Promise.all([
            prisma.landingPageWithUs.findMany({ where, orderBy: { order: 'asc' }, skip: (page - 1) * limit, take: limit }),
            prisma.landingPageWithUs.count({ where }),
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
        const data = await prisma.landingPageWithUs.create({
            data: { title: body.title, subtitle: body.subtitle, image: body.image || '', order: Number(body.order) || 0 },
        })
        return c.json({ data, status: 'success', message: 'Data With Us berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.landingPageWithUs.update({
            where: { id },
            data: { title: body.title, subtitle: body.subtitle, image: body.image || '', order: Number(body.order) || 0 },
        })
        return c.json({ data, status: 'success', message: 'Data With Us berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.landingPageWithUs.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Data With Us berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
