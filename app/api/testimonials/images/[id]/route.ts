import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const imageId = Number(id);

    if (!imageId || Number.isNaN(imageId)) {
      return NextResponse.json(
        { data: null, status: "error", message: "ID gambar tidak valid" },
        { status: 400 },
      );
    }

    const image = await prisma.testimonialImage.findUnique({
      where: { id: imageId },
      select: {
        image: true,
        mimeType: true,
        fileName: true,
      },
    });

    if (!image) {
      return NextResponse.json(
        { data: null, status: "error", message: "Gambar tidak ditemukan" },
        { status: 404 },
      );
    }

    return new Response(image.image, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${image.fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        status: "error",
        message: (error as Error).message || "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}
