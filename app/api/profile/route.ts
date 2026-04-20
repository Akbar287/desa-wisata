import { prisma } from "@/lib/prisma";

// GET → ambil profile
export async function GET() {
  const profile = await prisma.villageProfile.findFirst({
    select: {
      id: true,
      history: true,
      videoUrl: true,
      address: true,
      phone: true,
      email: true,
      visions: {
        select: { text: true },
        orderBy: { order: "asc" },
      },
      missions: {
        select: { text: true },
        orderBy: { order: "asc" },
      },
      galleries: {
        select: { id: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return Response.json(profile);
}

// PUT → update profile
export async function PUT(req: Request) {
  const body = await req.json();
  const {
    history,
    videoUrl,
    address,
    phone,
    email,
    visions = [],
    missions = [],
    galleries = [],
  } = body ?? {};

  const safeVisions = Array.isArray(visions)
    ? visions
        .map((v) => ({ text: String(v?.text ?? "").trim() }))
        .filter((v) => v.text.length > 0)
    : [];

  const safeMissions = Array.isArray(missions)
    ? missions
        .map((m) => ({ text: String(m?.text ?? "").trim() }))
        .filter((m) => m.text.length > 0)
    : [];

  const incomingIds = Array.isArray(galleries)
    ? galleries
        .map((g) => Number(g?.id))
        .filter((id) => Number.isInteger(id) && id > 0)
    : [];

  // ⚠️ singleton → kita pakai id = 1
  const profileId = 1;

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
  });

  // replace visions
  await prisma.vision.deleteMany({ where: { profileId } });
  if (safeVisions.length > 0) {
    await prisma.vision.createMany({
      data: safeVisions.map((v, i) => ({
        text: v.text,
        order: i,
        profileId,
      })),
    });
  }

  // replace missions
  await prisma.mission.deleteMany({ where: { profileId } });
  if (safeMissions.length > 0) {
    await prisma.mission.createMany({
      data: safeMissions.map((m, i) => ({
        text: m.text,
        order: i,
        profileId,
      })),
    });
  }

  // Sync galleries by id list from client
  const existingImages = await prisma.profileGallery.findMany({
    where: { profileId },
    select: { id: true },
  });
  const existingIds = existingImages.map((img) => img.id);
  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

  if (toDelete.length > 0) {
    await prisma.profileGallery.deleteMany({
      where: {
        id: { in: toDelete },
      },
    });
  }

  return Response.json({ success: true });
}

import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  await writeFile(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/${fileName}`,
  });
}
