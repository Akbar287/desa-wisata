import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/destinations/admin')


app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()

        const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {}

        const [data, total] = await Promise.all([
            prisma.destination.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, imageBanner: true, isAktif: true,
                    priceWeekday: true, rating: true, reviewCount: true, createdAt: true,
                    _count: { select: { tours: true, destinationGalleries: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.destination.count({ where }),
        ])

        const totalPages = Math.ceil(total / limit)
        return c.json({
            data, status: 'success', message: 'OK',
            pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
        })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.get('/detail', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const data = await prisma.destination.findUnique({
            where: { id },
            include: {
                destinationGalleries: { orderBy: { createdAt: 'desc' } },
                destinationLabels: { include: { label: { select: { id: true, name: true } } } },
                destinationAccessibilities: { include: { accessibility: { select: { id: true, name: true } } } },
                destinationFacilities: { include: { facility: { select: { id: true, name: true } } } },
            },
        })
        if (!data) return c.json({ data: null, status: 'error', message: 'Tidak ditemukan' }, { status: 404 })
        return c.json({ data, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.get('/ref', async (c) => {
    try {
        const [labels, accessibilities, facilities] = await Promise.all([
            prisma.destinationLabel.findMany({ select: { id: true, name: true, description: true, icon: true }, orderBy: { name: 'asc' } }),
            prisma.destinationAccessibility.findMany({ select: { id: true, name: true, description: true, icon: true }, orderBy: { name: 'asc' } }),
            prisma.destinationFacility.findMany({ select: { id: true, name: true, description: true, icon: true }, orderBy: { name: 'asc' } }),
        ])
        return c.json({ data: { labels, accessibilities, facilities }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.destination.create({
            data: {
                name: body.name,
                priceWeekend: Number(body.priceWeekend || 0),
                priceWeekday: Number(body.priceWeekday || 0),
                priceGroup: Number(body.priceGroup || 0),
                minimalGroup: Number(body.minimalGroup || 1),
                jamBuka: body.jamBuka || '',
                jamTutup: body.jamTutup || '',
                durasiRekomendasi: body.durasiRekomendasi || '',
                isAktif: body.isAktif ?? true,
                imageBanner: body.imageBanner || '',
                description: body.description || '',
                KuotaHarian: Number(body.KuotaHarian || 0),
                rating: Number(body.rating || 0),
                reviewCount: Number(body.reviewCount || 0),
            },
        })
        return c.json({ data, status: 'success', message: 'Destinasi berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.destination.update({
            where: { id },
            data: {
                name: body.name,
                priceWeekend: Number(body.priceWeekend),
                priceWeekday: Number(body.priceWeekday),
                priceGroup: Number(body.priceGroup),
                minimalGroup: Number(body.minimalGroup),
                jamBuka: body.jamBuka,
                jamTutup: body.jamTutup,
                durasiRekomendasi: body.durasiRekomendasi,
                isAktif: body.isAktif,
                imageBanner: body.imageBanner,
                description: body.description,
                KuotaHarian: Number(body.KuotaHarian),
                rating: Number(body.rating),
                reviewCount: Number(body.reviewCount),
            },
        })
        return c.json({ data, status: 'success', message: 'Destinasi berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.destination.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Destinasi berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})


app.post('/labels', async (c) => {
    try {
        const { destinationId, labelIds } = await c.req.json()
        await prisma.destinationLabelDestination.deleteMany({ where: { destinationId: Number(destinationId) } })
        if (labelIds?.length) {
            await prisma.destinationLabelDestination.createMany({
                data: labelIds.map((labelId: number) => ({ destinationId: Number(destinationId), labelId })),
            })
        }
        return c.json({ data: null, status: 'success', message: 'Label berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})


app.post('/accessibilities', async (c) => {
    try {
        const { destinationId, accessibilityIds } = await c.req.json()
        await prisma.destinationAccessibilityDestination.deleteMany({ where: { destinationId: Number(destinationId) } })
        if (accessibilityIds?.length) {
            await prisma.destinationAccessibilityDestination.createMany({
                data: accessibilityIds.map((accessibilityId: number) => ({ destinationId: Number(destinationId), accessibilityId })),
            })
        }
        return c.json({ data: null, status: 'success', message: 'Aksesibilitas berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})


app.post('/facilities', async (c) => {
    try {
        const { destinationId, facilityIds } = await c.req.json()
        await prisma.destinationFacilityDestination.deleteMany({ where: { destinationId: Number(destinationId) } })
        if (facilityIds?.length) {
            await prisma.destinationFacilityDestination.createMany({
                data: facilityIds.map((facilityId: number) => ({ destinationId: Number(destinationId), facilityId })),
            })
        }
        return c.json({ data: null, status: 'success', message: 'Fasilitas berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})


app.post('/gallery', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.destinationGallery.create({
            data: { destinationId: Number(body.destinationId), image: body.image },
        })
        return c.json({ data, status: 'success', message: 'Gambar berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/gallery', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.destinationGallery.update({
            where: { id },
            data: { image: body.image },
        })
        return c.json({ data, status: 'success', message: 'Gambar berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/gallery', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.destinationGallery.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Gambar berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── LABEL MASTER CRUD ──────────────────────────────────────

app.post('/label-master', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.destinationLabel.create({ data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Label berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/label-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.destinationLabel.update({ where: { id }, data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Label berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/label-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.destinationLabel.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Label berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── ACCESSIBILITY MASTER CRUD ──────────────────────────────

app.post('/accessibility-master', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.destinationAccessibility.create({ data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Aksesibilitas berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/accessibility-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.destinationAccessibility.update({ where: { id }, data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Aksesibilitas berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/accessibility-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.destinationAccessibility.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Aksesibilitas berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── FACILITY MASTER CRUD ───────────────────────────────────

app.post('/facility-master', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.destinationFacility.create({ data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Fasilitas berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/facility-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.destinationFacility.update({ where: { id }, data: { name: body.name, description: body.description || '', icon: body.icon || '' } })
        return c.json({ data, status: 'success', message: 'Fasilitas berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/facility-master', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.destinationFacility.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Fasilitas berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
