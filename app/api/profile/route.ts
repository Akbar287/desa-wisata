import { ProfileGallery } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma' // sesuaikan path kalau beda

// GET → ambil profile
export async function GET() {
    const profile = await prisma.villageProfile.findFirst({
        include: {
            visions: true,
            missions: true,
            galleries: true,
        },
    })

    return Response.json(profile)
}

// PUT → update profile
export async function PUT(req: Request) {
    const body = await req.json()
    console.log("BODY:", body)

    const {
        history,
        videoUrl,
        address,
        phone,
        email,
        visions,
        missions,
    } = body

    // ⚠️ singleton → kita pakai id = 1
    const profileId = 1

    // update main profile
    await prisma.villageProfile.upsert({
        where: { id: profileId },
        update: {
            history,
            videoUrl,
            address,
            phone,
            email,
        },
        create: {
            id: profileId,
            history,
            videoUrl,
            address,
            phone,
            email,
        },
    })

    // replace visions
    await prisma.vision.deleteMany({ where: { profileId } })

    await prisma.vision.createMany({
        data: visions.map((v: any, i: number) => ({
            text: v.text,
            order: i,
            profileId,
        })),
    })

    // replace missions
    await prisma.mission.deleteMany({ where: { profileId } })

    await prisma.mission.createMany({
        data: missions.map((m: any, i: number) => ({
            text: m.text,
            order: i,
            profileId,
        })),
    })


    return Response.json({ success: true })
}

import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = Date.now() + '-' + file.name
    const filePath = path.join(process.cwd(), 'public/uploads', fileName)

    await writeFile(filePath, buffer)

    return NextResponse.json({
        url: `/uploads/${fileName}`,
    })
}