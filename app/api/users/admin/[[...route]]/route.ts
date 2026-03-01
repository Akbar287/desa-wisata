import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const app = new Hono().basePath('/api/users/admin')

// ─── USERS CRUD ─────────────────────────────────────────────

app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] } : {}

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where, orderBy: { createdAt: 'desc' },
                include: { UserRole: { include: { role: true } }, _count: { select: { UserLogin: true } } },
                skip: (page - 1) * limit, take: limit,
            }),
            prisma.user.count({ where }),
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
        const data = await prisma.user.create({
            data: {
                name: body.name, email: body.email, age: Number(body.age), gender: body.gender,
                nationality: body.nationality, phoneCode: body.phoneCode, phoneNumber: body.phoneNumber,
                address: body.address, avatar: body.avatar || '',
            },
            include: { UserRole: { include: { role: true } }, _count: { select: { UserLogin: true } } },
        })
        return c.json({ data, status: 'success', message: 'Pengguna berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.user.update({
            where: { id },
            data: {
                name: body.name, email: body.email, age: Number(body.age), gender: body.gender,
                nationality: body.nationality, phoneCode: body.phoneCode, phoneNumber: body.phoneNumber,
                address: body.address, avatar: body.avatar || '',
            },
            include: { UserRole: { include: { role: true } }, _count: { select: { UserLogin: true } } },
        })
        return c.json({ data, status: 'success', message: 'Pengguna berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.user.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Pengguna berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── REF (Roles list) ───────────────────────────────────────

app.get('/ref', async (c) => {
    try {
        const roles = await prisma.role.findMany({ orderBy: { name: 'asc' } })
        return c.json({ data: { roles }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── USER ROLES (junction) ─────────────────────────────────

app.post('/roles', async (c) => {
    try {
        const { userId, roleIds } = await c.req.json()
        await prisma.userRole.deleteMany({ where: { userId: Number(userId) } })
        if (roleIds?.length) {
            await prisma.userRole.createMany({ data: roleIds.map((roleId: number) => ({ userId: Number(userId), roleId })) })
        }
        const data = await prisma.userRole.findMany({ where: { userId: Number(userId) }, include: { role: true } })
        return c.json({ data, status: 'success', message: 'Role berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── USER LOGINS ────────────────────────────────────────────

app.get('/logins', async (c) => {
    const userId = Number(c.req.query('userId'))
    if (!userId) return c.json({ data: [], status: 'error', message: 'userId wajib' }, { status: 400 })
    try {
        const data = await prisma.userLogin.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
        return c.json({ data, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: [], status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/logins', async (c) => {
    try {
        const body = await c.req.json()
        const hashedPassword = await bcrypt.hash(body.Password, 10)
        const data = await prisma.userLogin.create({ data: { userId: Number(body.userId), Username: body.Username, Password: hashedPassword } })
        return c.json({ data, status: 'success', message: 'Login berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/logins', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const updateData: Record<string, unknown> = { Username: body.Username }
        if (body.Password) updateData.Password = await bcrypt.hash(body.Password, 10)
        const data = await prisma.userLogin.update({ where: { id }, data: updateData })
        return c.json({ data, status: 'success', message: 'Login berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/logins', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.userLogin.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Login berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

// ─── ROLES MANAGEMENT ──────────────────────────────────────

app.get('/manage-roles', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page') || '1'))
        const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || '10')))
        const search = (c.req.query('search') || '').trim()
        const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {}
        const [data, total] = await Promise.all([
            prisma.role.findMany({ where, orderBy: { name: 'asc' }, include: { _count: { select: { UserRole: true } } }, skip: (page - 1) * limit, take: limit }),
            prisma.role.count({ where }),
        ])
        const totalPages = Math.ceil(total / limit)
        return c.json({ data, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }, status: 'success', message: 'OK' })
    } catch (error) {
        return c.json({ data: [], pagination: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.post('/manage-roles', async (c) => {
    try {
        const body = await c.req.json()
        const data = await prisma.role.create({ data: { name: body.name, description: body.description || null } })
        return c.json({ data, status: 'success', message: 'Role berhasil ditambahkan' }, { status: 201 })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.put('/manage-roles', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        const body = await c.req.json()
        const data = await prisma.role.update({ where: { id }, data: { name: body.name, description: body.description || null } })
        return c.json({ data, status: 'success', message: 'Role berhasil diperbarui' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

app.delete('/manage-roles', async (c) => {
    const id = Number(c.req.query('_id'))
    if (!id) return c.json({ data: null, status: 'error', message: 'ID wajib' }, { status: 400 })
    try {
        await prisma.role.delete({ where: { id } })
        return c.json({ data: null, status: 'success', message: 'Role berhasil dihapus' })
    } catch (error) {
        return c.json({ data: null, status: 'error', message: (error as Error).message }, { status: 500 })
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
