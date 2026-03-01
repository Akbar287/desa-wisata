import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/tours/admin')

// ─── TOUR CRUD ───────────────────────────────────────────────

// GET / — List tours (paginated, search)
app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()

        const where = search ? { title: { contains: search, mode: 'insensitive' as const } } : {}

        const [data, total] = await Promise.all([
            prisma.tour.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            themes: true, destinations: true, highlights: true, gallery: true,
                            itinerary: true, included: true, excluded: true, dates: true,
                            reviews: true, goodToKnow: true,
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.tour.count({ where }),
        ])
        const totalPages = Math.ceil(total / limit)
        return c.json({
            data, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
            status: 'success', message: 'OK',
        })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// GET /detail?_id=X — Get tour detail with all relations
app.get('/detail', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const data = await prisma.tour.findUnique({
            where: { id },
            include: {
                themes: { include: { theme: true } },
                destinations: { include: { destination: true } },
                highlights: { orderBy: { order: 'asc' } },
                gallery: { orderBy: { order: 'asc' } },
                itinerary: { orderBy: { day: 'asc' }, include: { meals: true } },
                included: { orderBy: { order: 'asc' } },
                excluded: { orderBy: { order: 'asc' } },
                dates: { orderBy: { startDate: 'asc' } },
                reviews: { orderBy: { createdAt: 'desc' } },
                goodToKnow: { orderBy: { order: 'asc' } },
                relatedFrom: { include: { toTour: { select: { id: true, title: true, image: true } } } },
                specialPkg: true,
                privatePkg: { include: { includes: { orderBy: { order: 'asc' } } } },
            },
        })
        if (!data) return c.json({ data: null, status: 'error', message: 'Tour tidak ditemukan' }, { status: 404 })
        return c.json({ data, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// POST / — Create tour
app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tour.create({
            data: {
                title: body.title,
                type: body.type,
                durationDays: Number(body.durationDays),
                price: Number(body.price),
                image: body.image || '',
                heroImage: body.heroImage || null,
                overview: body.overview || null,
                groupSize: body.groupSize || null,
                rating: Number(body.rating || 0),
                reviewCount: Number(body.reviewCount || 0),
            },
        })
        return c.json({ data, status: 'success', message: 'Tour berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// PUT / — Update tour basic
app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tour.update({
            where: { id },
            data: {
                title: body.title,
                type: body.type,
                durationDays: Number(body.durationDays),
                price: Number(body.price),
                image: body.image,
                heroImage: body.heroImage || null,
                overview: body.overview || null,
                groupSize: body.groupSize || null,
                rating: Number(body.rating || 0),
                reviewCount: Number(body.reviewCount || 0),
            },
        })
        return c.json({ data, status: 'success', message: 'Tour berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// DELETE / — Delete tour
app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tour.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Tour berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── REF DATA ────────────────────────────────────────────────

// GET /ref — Get themes, destinations, tours for select boxes
app.get('/ref', async (c) => {
    try {
        const [themes, destinations, tours] = await Promise.all([
            prisma.theme.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
            prisma.destination.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
            prisma.tour.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true, image: true } }),
        ])
        return c.json({ data: { themes, destinations, tours }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── THEMES (junction) ──────────────────────────────────────

app.post('/themes', async (c) => {
    try {
        const { tourId, themeIds } = await c.req.json()
        // Delete existing, re-create
        await prisma.tourTheme.deleteMany({ where: { tourId: Number(tourId) } })
        if (themeIds?.length) {
            await prisma.tourTheme.createMany({
                data: themeIds.map((themeId: number) => ({ tourId: Number(tourId), themeId })),
            })
        }
        const data = await prisma.tourTheme.findMany({ where: { tourId: Number(tourId) }, include: { theme: true } })
        return c.json({ data, status: 'success', message: 'Tema berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── DESTINATIONS (junction) ────────────────────────────────

app.post('/destinations', async (c) => {
    try {
        const { tourId, destinationIds } = await c.req.json()
        await prisma.tourDestination.deleteMany({ where: { tourId: Number(tourId) } })
        if (destinationIds?.length) {
            await prisma.tourDestination.createMany({
                data: destinationIds.map((destinationId: number) => ({ tourId: Number(tourId), destinationId })),
            })
        }
        const data = await prisma.tourDestination.findMany({ where: { tourId: Number(tourId) }, include: { destination: true } })
        return c.json({ data, status: 'success', message: 'Destinasi berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── HIGHLIGHTS ─────────────────────────────────────────────

app.post('/highlights', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourHighlight.create({ data: { tourId: Number(body.tourId), text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Sorotan berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/highlights', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourHighlight.update({ where: { id }, data: { text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Sorotan berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/highlights', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourHighlight.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Sorotan berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── GALLERY ────────────────────────────────────────────────

app.post('/gallery', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourGallery.create({ data: { tourId: Number(body.tourId), image: body.image, order: Number(body.order || 0) } })
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
        const data = await prisma.tourGallery.update({ where: { id }, data: { image: body.image, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Gambar berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/gallery', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourGallery.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Gambar berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── ITINERARY ──────────────────────────────────────────────

app.post('/itinerary', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.dayItinerary.create({
            data: {
                tourId: Number(body.tourId), day: Number(body.day), title: body.title,
                description: body.description, distance: body.distance || null,
                meals: { create: (body.meals || []).map((m: string) => ({ meal: m as 'B' | 'L' | 'D' })) },
            },
            include: { meals: true },
        })
        return c.json({ data, status: 'success', message: 'Itinerari berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/itinerary', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        await prisma.dayItineraryMeal.deleteMany({ where: { dayItineraryId: id } })
        const data = await prisma.dayItinerary.update({
            where: { id },
            data: {
                day: Number(body.day), title: body.title, description: body.description,
                distance: body.distance || null,
                meals: { create: (body.meals || []).map((m: string) => ({ meal: m as 'B' | 'L' | 'D' })) },
            },
            include: { meals: true },
        })
        return c.json({ data, status: 'success', message: 'Itinerari berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/itinerary', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.dayItinerary.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Itinerari berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── INCLUSIONS ─────────────────────────────────────────────

app.post('/inclusions', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourInclusion.create({ data: { tourId: Number(body.tourId), text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Item berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/inclusions', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourInclusion.update({ where: { id }, data: { text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Item berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/inclusions', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourInclusion.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Item berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── EXCLUSIONS ─────────────────────────────────────────────

app.post('/exclusions', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourExclusion.create({ data: { tourId: Number(body.tourId), text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Item berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/exclusions', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourExclusion.update({ where: { id }, data: { text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Item berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/exclusions', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourExclusion.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Item berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── DATES ──────────────────────────────────────────────────

app.post('/dates', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourDate.create({
            data: {
                tourId: Number(body.tourId),
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                status: body.status,
                price: Number(body.price),
            },
        })
        return c.json({ data, status: 'success', message: 'Jadwal berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/dates', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourDate.update({
            where: { id },
            data: { startDate: new Date(body.startDate), endDate: new Date(body.endDate), status: body.status, price: Number(body.price) },
        })
        return c.json({ data, status: 'success', message: 'Jadwal berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/dates', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourDate.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Jadwal berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── REVIEWS ────────────────────────────────────────────────

app.post('/reviews', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourReview.create({
            data: {
                tourId: Number(body.tourId), name: body.name, avatar: body.avatar || null,
                rating: Number(body.rating), date: new Date(body.date),
                text: body.text, location: body.location || null,
            },
        })
        return c.json({ data, status: 'success', message: 'Ulasan berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/reviews', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourReview.update({
            where: { id },
            data: { name: body.name, avatar: body.avatar || null, rating: Number(body.rating), date: new Date(body.date), text: body.text, location: body.location || null },
        })
        return c.json({ data, status: 'success', message: 'Ulasan berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/reviews', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourReview.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Ulasan berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── GOOD TO KNOW ───────────────────────────────────────────

app.post('/good-to-know', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.tourGoodToKnow.create({ data: { tourId: Number(body.tourId), title: body.title, text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Info berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.put('/good-to-know', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.tourGoodToKnow.update({ where: { id }, data: { title: body.title, text: body.text, order: Number(body.order || 0) } })
        return c.json({ data, status: 'success', message: 'Info berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/good-to-know', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.tourGoodToKnow.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Info berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── RELATED TOURS ──────────────────────────────────────────

app.post('/related', async (c) => {
    try {
        const { tourId, relatedTourIds } = await c.req.json()
        await prisma.tourRelated.deleteMany({ where: { fromTourId: Number(tourId) } })
        if (relatedTourIds?.length) {
            await prisma.tourRelated.createMany({
                data: relatedTourIds.map((toTourId: number) => ({ fromTourId: Number(tourId), toTourId })),
            })
        }
        const data = await prisma.tourRelated.findMany({
            where: { fromTourId: Number(tourId) },
            include: { toTour: { select: { id: true, title: true, image: true } } },
        })
        return c.json({ data, status: 'success', message: 'Tour terkait berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── SPECIAL PACKAGE ────────────────────────────────────────

app.post('/special-package', async (c) => {
    try {
        const body = await c.req.json()
        const existing = await prisma.specialPackage.findUnique({ where: { tourId: Number(body.tourId) } })
        const dataPayload = {
            subtitle: body.subtitle, originalPrice: Number(body.originalPrice), discount: Number(body.discount),
            badge: body.badge, badgeEmoji: body.badgeEmoji, gradient: body.gradient,
            groupSize: body.groupSize, season: body.season, dateRange: body.dateRange, limitedSlots: Number(body.limitedSlots),
        }
        const data = existing
            ? await prisma.specialPackage.update({ where: { tourId: Number(body.tourId) }, data: dataPayload })
            : await prisma.specialPackage.create({ data: { tourId: Number(body.tourId), ...dataPayload } })
        return c.json({ data, status: 'success', message: 'Paket spesial berhasil disimpan' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/special-package', async (c) => {
    const tourId = Number(c.req.query('tourId'))
    if (!tourId) return c.json({ data: null, status: 'error', message: 'tourId wajib' }, { status: 400 })
    try {
        await prisma.specialPackage.delete({ where: { tourId } })
        return c.json({ data: null, status: 'success', message: 'Paket spesial berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── PRIVATE PACKAGE ────────────────────────────────────────

app.post('/private-package', async (c) => {
    try {
        const body = await c.req.json()
        const existing = await prisma.privatePackage.findUnique({ where: { tourId: Number(body.tourId) } })
        if (existing) {
            await prisma.privatePackageInclusion.deleteMany({ where: { privatePackageId: existing.id } })
            const data = await prisma.privatePackage.update({
                where: { tourId: Number(body.tourId) },
                data: {
                    tagline: body.tagline, maxGuests: Number(body.maxGuests), priceNote: body.priceNote, tier: body.tier,
                    includes: { create: (body.includes || []).map((text: string, i: number) => ({ text, order: i })) },
                },
                include: { includes: { orderBy: { order: 'asc' } } },
            })
            return c.json({ data, status: 'success', message: 'Paket privat berhasil diperbarui' })
        } else {
            const data = await prisma.privatePackage.create({
                data: {
                    tourId: Number(body.tourId), tagline: body.tagline, maxGuests: Number(body.maxGuests),
                    priceNote: body.priceNote, tier: body.tier,
                    includes: { create: (body.includes || []).map((text: string, i: number) => ({ text, order: i })) },
                },
                include: { includes: { orderBy: { order: 'asc' } } },
            })
            return c.json({ data, status: 'success', message: 'Paket privat berhasil ditambahkan' }, { status: 201 })
        }
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})
app.delete('/private-package', async (c) => {
    const tourId = Number(c.req.query('tourId'))
    if (!tourId) return c.json({ data: null, status: 'error', message: 'tourId wajib' }, { status: 400 })
    try {
        await prisma.privatePackage.delete({ where: { tourId } })
        return c.json({ data: null, status: 'success', message: 'Paket privat berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── EXPORT ─────────────────────────────────────────────────

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
