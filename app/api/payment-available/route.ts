import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/payment-available')

// GET — list with pagination & search
app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page')) || 1)
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit')) || 10))
        const search = c.req.query('search')?.trim() || ''

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { accountNumber: { contains: search, mode: 'insensitive' as const } },
                    { accountName: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {}

        const [total, data] = await Promise.all([
            prisma.paymentAvailable.count({ where }),
            prisma.paymentAvailable.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { _count: { select: { payments: true } } },
            }),
        ])

        const totalPages = Math.ceil(total / limit)

        return c.json({
            status: 'success',
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            },
        })
    } catch (err) {
        console.error('PaymentAvailable list error:', err)
        return c.json({ status: 'error', message: 'Gagal mengambil data' }, 500)
    }
})

// POST — create
app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { name, accountNumber, accountName, image, description, type, isActive } = body

        if (!name || !accountNumber || !accountName || !image || !description || !type) {
            return c.json({ status: 'error', message: 'Data tidak lengkap' }, 400)
        }

        const data = await prisma.paymentAvailable.create({
            data: { name, accountNumber, accountName, image, description, type, isActive: isActive ?? true },
        })

        return c.json({ status: 'success', message: 'Metode pembayaran berhasil ditambahkan', data })
    } catch (err) {
        console.error('PaymentAvailable create error:', err)
        return c.json({ status: 'error', message: 'Gagal menambahkan data' }, 500)
    }
})

// PUT — update
app.put('/', async (c) => {
    try {
        const id = Number(c.req.query('_id'))
        if (!id) return c.json({ status: 'error', message: 'ID tidak valid' }, 400)

        const body = await c.req.json()
        const { name, accountNumber, accountName, image, description, type, isActive } = body

        const data = await prisma.paymentAvailable.update({
            where: { id },
            data: { name, accountNumber, accountName, image, description, type, isActive },
        })

        return c.json({ status: 'success', message: 'Metode pembayaran berhasil diperbarui', data })
    } catch (err) {
        console.error('PaymentAvailable update error:', err)
        return c.json({ status: 'error', message: 'Gagal memperbarui data' }, 500)
    }
})

// DELETE — delete
app.delete('/', async (c) => {
    try {
        const id = Number(c.req.query('_id'))
        if (!id) return c.json({ status: 'error', message: 'ID tidak valid' }, 400)

        await prisma.paymentAvailable.delete({ where: { id } })

        return c.json({ status: 'success', message: 'Metode pembayaran berhasil dihapus' })
    } catch (err) {
        console.error('PaymentAvailable delete error:', err)
        return c.json({ status: 'error', message: 'Gagal menghapus data' }, 500)
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
