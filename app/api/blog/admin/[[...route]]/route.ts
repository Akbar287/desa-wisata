import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/blog/admin')

// ─── BLOG POST CRUD ─────────────────────────────────────────

app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { title: { contains: search, mode: 'insensitive' as const } } : {}

        const [data, total] = await Promise.all([
            prisma.blogPost.findMany({
                where, orderBy: { date: 'desc' },
                include: { author: true, _count: { select: { tags: true, relatedFrom: true } } },
                skip: (page - 1) * limit, take: limit,
            }),
            prisma.blogPost.count({ where }),
        ])
        const totalPages = Math.ceil(total / limit)
        return c.json({ data, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.get('/detail', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const data = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: true,
                tags: { orderBy: { id: 'asc' } },
                relatedFrom: { include: { toPost: { select: { id: true, title: true, image: true } } } },
            },
        })
        if (!data) return c.json({ data: null, status: 'error', message: 'Post tidak ditemukan' }, { status: 404 })
        return c.json({ data, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.blogPost.create({
            data: {
                title: body.title, excerpt: body.excerpt, image: body.image,
                date: new Date(body.date), category: body.category, readTime: body.readTime,
                authorId: body.authorId ? Number(body.authorId) : null,
                content: body.content || [],
            },
            include: { author: true },
        })
        return c.json({ data, status: 'success', message: 'Post berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.blogPost.update({
            where: { id },
            data: {
                title: body.title, excerpt: body.excerpt, image: body.image,
                date: new Date(body.date), category: body.category, readTime: body.readTime,
                authorId: body.authorId ? Number(body.authorId) : null,
                content: body.content || [],
            },
            include: { author: true },
        })
        return c.json({ data, status: 'success', message: 'Post berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.blogPost.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Post berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── REF DATA ───────────────────────────────────────────────

app.get('/ref', async (c) => {
    try {
        const [authors, posts] = await Promise.all([
            prisma.blogAuthor.findMany({ orderBy: { name: 'asc' } }),
            prisma.blogPost.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true, image: true } }),
        ])
        return c.json({ data: { authors, posts }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── TAGS ───────────────────────────────────────────────────

app.post('/tags', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.blogTag.create({ data: { postId: Number(body.postId), tag: body.tag } })
        return c.json({ data, status: 'success', message: 'Tag berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/tags', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.blogTag.update({ where: { id }, data: { tag: body.tag } })
        return c.json({ data, status: 'success', message: 'Tag berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/tags', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.blogTag.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Tag berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── RELATED POSTS ──────────────────────────────────────────

app.post('/related', async (c) => {
    try {
        const { postId, relatedPostIds } = await c.req.json()
        await prisma.blogRelated.deleteMany({ where: { fromPostId: Number(postId) } })
        if (relatedPostIds?.length) {
            await prisma.blogRelated.createMany({
                data: relatedPostIds.map((toPostId: number) => ({ fromPostId: Number(postId), toPostId })),
            })
        }
        const data = await prisma.blogRelated.findMany({
            where: { fromPostId: Number(postId) },
            include: { toPost: { select: { id: true, title: true, image: true } } },
        })
        return c.json({ data, status: 'success', message: 'Post terkait berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── AUTHORS ────────────────────────────────────────────────

app.get('/authors', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {}
        const [data, total] = await Promise.all([
            prisma.blogAuthor.findMany({ where, orderBy: { name: 'asc' }, include: { _count: { select: { posts: true } } }, skip: (page - 1) * limit, take: limit }),
            prisma.blogAuthor.count({ where }),
        ])
        const totalPages = Math.ceil(total / limit)
        return c.json({ data, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/authors', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.blogAuthor.create({ data: { name: body.name, avatar: body.avatar || null, role: body.role } })
        return c.json({ data, status: 'success', message: 'Penulis berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/authors', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.blogAuthor.update({ where: { id }, data: { name: body.name, avatar: body.avatar || null, role: body.role } })
        return c.json({ data, status: 'success', message: 'Penulis berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/authors', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.blogAuthor.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Penulis berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
