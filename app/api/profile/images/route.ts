import { prisma } from '@/lib/prisma' // sesuaikan path kalau beda
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  
  const profile = await prisma.villageProfile.upsert({
  where: { id: 1 },
  update: {},
  create: {
    history: "",
    videoUrl: "",
    address: "",
    phone: "",
    email: "",
  },
})

  const newImage = await prisma.profileGallery.create({
    data: {
      image: Buffer.from(bytes),
      mimeType: file.type,
      fileName: file.name,
      profileId: profile!.id,
    },
  })

  return NextResponse.json({ id: newImage.id })
}