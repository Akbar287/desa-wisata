import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono().basePath('/api/img')

app.get('/', async (c) => {
    const id = c.req.query('_id') as string | undefined

    if (id !== undefined) {
        const data = await prisma.file.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (data !== null) {
            try {
                if (!data || !data.file) {
                    return c.json(
                        { data: [], status: 'error', message: 'file not found in DB' },
                        { status: 404 }
                    )
                }

                const contentType =
                    mime.getType(data.name) ||
                    'application/octet-stream'

                return c.body(data.file, 200, {
                    'Content-Type': contentType,
                    'Content-Disposition': `inline; filename="${data.name}"`,
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'error'
                return c.json(
                    { data: [], status: 'error', message: errorMessage },
                    { status: 500 }
                )
            }
        } else {
            return c.json(
                { data: [], status: 'error', message: 'file is not found' },
                { status: 404 }
            )
        }

    } else {
        return c.json(
            { data: [], status: 'error', message: 'file is required' },
            { status: 400 }
        )
    }
})

app.post('/', async (c) => {
    const data = await c.req.parseBody()
    const file = data.files


    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const allowedExtensions = ['pdf', 'doc', 'docx']

    const fileExt = mime.getExtension(file.type) || ''
    if (
        !allowedMimeTypes.includes(file.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya PDF dan Word (doc/docx) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}.${fileExt}`

    const fileData = await prisma.file.create({
        data: {
            name: filename,
            file: buffer,
            size: file.size,
            type: file.type,
        },
    })

    return c.json({ data: fileData, status: 'success', message: 'file is uploaded' })
})

app.delete('/', async (c) => {
    const id = c.req.query('_id') as string | undefined

    if (id !== undefined) {
        const data = await prisma.file.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({ data: data, status: 'success', message: 'file is deleted' })
    } else {
        return c.json(
            { data: [], status: 'error', message: 'file is required' },
            { status: 400 }
        )
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)