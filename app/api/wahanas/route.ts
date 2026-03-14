import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/wahanas')

const normalizeMapIds = (input: unknown): number[] => {
    if (!Array.isArray(input)) return []
    const normalized = input
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0)

    return [...new Set(normalized)]
}

const serializeWahana = (item: {
    id: number
    name: string
    price: number
    description: string
    imageBanner: string
    rating: number
    reviewCount: number
    createdAt: Date
    updatedAt: Date
    WahanaGallery: { id: number; image: string; createdAt: Date; updatedAt: Date }[]
    maps: {
        id: number
        mapId: number
        wahanaId: number
        order: number
        map: {
            id: number
            title: string
            content: string
            image: string
            icon: string
            lat: number
            lng: number
            fasilitas: boolean
        }
    }[]
}) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    imageBanner: item.imageBanner,
    rating: item.rating,
    reviewCount: item.reviewCount,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    WahanaGallery: item.WahanaGallery.map((gallery) => ({
        id: gallery.id,
        image: gallery.image,
    })),
    maps: item.maps.map((mapRelation) => ({
        id: mapRelation.map.id,
        mapId: mapRelation.mapId,
        wahanaId: mapRelation.wahanaId,
        title: mapRelation.map.title,
        content: mapRelation.map.content,
        image: mapRelation.map.image,
        icon: mapRelation.map.icon,
        lat: mapRelation.map.lat,
        lng: mapRelation.map.lng,
        fasilitas: mapRelation.map.fasilitas,
        order: mapRelation.order,
    })),
})

// GET - List wahanas with pagination & search
app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()

        const where = search
            ? { name: { contains: search, mode: 'insensitive' as const } }
            : {}

        const [rows, total] = await Promise.all([
            prisma.wahana.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    WahanaGallery: { orderBy: { createdAt: 'desc' } },
                    maps: {
                        orderBy: { order: 'asc' },
                        include: {
                            map: {
                                select: {
                                    id: true,
                                    title: true,
                                    content: true,
                                    image: true,
                                    icon: true,
                                    lat: true,
                                    lng: true,
                                    fasilitas: true,
                                },
                            },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.wahana.count({ where }),
        ])

        const data = rows.map(serializeWahana)
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
        const { name, price, description, imageBanner, gallery, mapIds } = body

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

        const normalizedMapIds = normalizeMapIds(mapIds)

        const data = await prisma.wahana.create({
            data: {
                name,
                price: Number(price),
                description,
                imageBanner,
                WahanaGallery: {
                    create: Array.isArray(gallery) ? gallery.map((g: { image: string }) => ({
                        image: g.image
                    })) : []
                },
                maps: {
                    create: normalizedMapIds.map((mapId, index) => ({
                        map: { connect: { id: mapId } },
                        order: index,
                    })),
                },
            },
            include: {
                WahanaGallery: true,
                maps: {
                    orderBy: { order: 'asc' },
                    include: {
                        map: {
                            select: {
                                id: true,
                                title: true,
                                content: true,
                                image: true,
                                icon: true,
                                lat: true,
                                lng: true,
                                fasilitas: true,
                            },
                        },
                    },
                },
            },
        })

        return c.json(
            { data: serializeWahana(data), status: 'success', message: 'Wahana berhasil ditambahkan' },
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

// PUT - Update wahana
app.put('/', async (c) => {
    const id = c.req.query('_id')

    if (!id) {
        return c.json(
            { data: null, status: 'error', message: 'ID wahana wajib diisi' },
            { status: 400 }
        )
    }

    const idNum = Number(id)
    if (!Number.isFinite(idNum) || idNum <= 0) {
        return c.json(
            { data: null, status: 'error', message: 'ID wahana tidak valid' },
            { status: 400 }
        )
    }

    try {
        const body = await c.req.json()
        const { name, price, description, imageBanner, gallery, mapIds } = body

        if (!name || isNaN(Number(price)) || !description || !imageBanner) {
            return c.json(
                { data: null, status: 'error', message: 'Semua field wajib diisi' },
                { status: 400 }
            )
        }

        const existing = await prisma.wahana.findFirst({
            where: {
                name,
                NOT: { id: idNum },
            },
            select: { id: true },
        })
        if (existing) {
            return c.json(
                { data: null, status: 'error', message: 'Nama wahana sudah ada' },
                { status: 409 }
            )
        }

        const normalizedMapIds = normalizeMapIds(mapIds)

        await prisma.wahanaGallery.deleteMany({
            where: { wahanaId: idNum }
        })
        await prisma.mapsWahana.deleteMany({
            where: { wahanaId: idNum }
        })

        const data = await prisma.wahana.update({
            where: { id: idNum },
            data: {
                name,
                price: Number(price),
                description,
                imageBanner,
                WahanaGallery: {
                    create: Array.isArray(gallery) ? gallery.map((g: { image: string }) => ({
                        image: g.image
                    })) : []
                },
                maps: {
                    create: normalizedMapIds.map((mapId, index) => ({
                        map: { connect: { id: mapId } },
                        order: index,
                    })),
                },
            },
            include: {
                WahanaGallery: true,
                maps: {
                    orderBy: { order: 'asc' },
                    include: {
                        map: {
                            select: {
                                id: true,
                                title: true,
                                content: true,
                                image: true,
                                icon: true,
                                lat: true,
                                lng: true,
                                fasilitas: true,
                            },
                        },
                    },
                },
            },
        })

        return c.json({ data: serializeWahana(data), status: 'success', message: 'Wahana berhasil diperbarui' })
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
