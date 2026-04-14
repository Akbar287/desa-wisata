import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_SIZE_MB = 8;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function toFirstString(value: FormDataEntryValue | null): string {
  if (!value) return "";
  return String(value);
}

function toImageUrl(id: number): string {
  return `/api/testimonials/images/${id}`;
}

function normalizeTestimonialPayload(testimonial: {
  id: number;
  isPublished: boolean;
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: Date;
  images: Array<{
    id: number;
    fileName: string;
    mimeType: string;
    size: number;
  }>;
}) {
  return {
    id: testimonial.id,
    isPublished: testimonial.isPublished,
    name: testimonial.name,
    role: testimonial.role,
    text: testimonial.text,
    rating: testimonial.rating,
    createdAt: testimonial.createdAt,
    images: testimonial.images.map((img) => ({
      id: img.id,
      url: toImageUrl(img.id),
      fileName: img.fileName,
      mimeType: img.mimeType,
      size: img.size,
    })),
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const bookingCode = toFirstString(formData.get("bookingCode"))
      .trim()
      .toUpperCase();
    const name = toFirstString(formData.get("name")).trim();
    const role = toFirstString(formData.get("role")).trim() || "Wisatawan";
    const text = toFirstString(formData.get("text")).trim();
    const rating = Number(toFirstString(formData.get("rating")));

    const imageFiles = [
      ...formData
        .getAll("images")
        .filter((value): value is File => value instanceof File),
      ...formData
        .getAll("images[]")
        .filter((value): value is File => value instanceof File),
    ];

    if (!bookingCode) {
      return NextResponse.json(
        { data: null, status: "error", message: "Kode booking wajib diisi." },
        { status: 400 },
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { data: null, status: "error", message: "Nama minimal 2 karakter." },
        { status: 400 },
      );
    }

    if (!text || text.length < 10) {
      return NextResponse.json(
        {
          data: null,
          status: "error",
          message: "Testimoni minimal 10 karakter.",
        },
        { status: 400 },
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          data: null,
          status: "error",
          message: "Rating harus antara 1 hingga 5.",
        },
        { status: 400 },
      );
    }

    if (imageFiles.length < 1) {
      return NextResponse.json(
        {
          data: null,
          status: "error",
          message: "Upload foto minimal 1 gambar.",
        },
        { status: 400 },
      );
    }

    for (const image of imageFiles) {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(image.type)) {
        return NextResponse.json(
          {
            data: null,
            status: "error",
            message: "Format foto tidak didukung. Gunakan JPG/PNG/WebP/GIF.",
          },
          { status: 400 },
        );
      }

      if (image.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          {
            data: null,
            status: "error",
            message: `Ukuran foto maksimal ${MAX_IMAGE_SIZE_MB}MB per file.`,
          },
          { status: 400 },
        );
      }
    }

    const bookingPayment = await prisma.bookingPayment.findUnique({
      where: { bookingCode },
      include: {
        booking: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!bookingPayment?.booking) {
      return NextResponse.json(
        { data: null, status: "error", message: "Booking tidak ditemukan." },
        { status: 404 },
      );
    }

    const existing = await prisma.testimonial.findFirst({
      where: { bookingId: bookingPayment.booking.id },
      include: {
        images: {
          select: { id: true, fileName: true, mimeType: true, size: true },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return NextResponse.json(
        {
          data: {
            testimonial: normalizeTestimonialPayload(existing),
          },
          status: "error",
          message: "Testimoni untuk booking ini sudah pernah dikirim.",
        },
        { status: 409 },
      );
    }

    const imageCreates = await Promise.all(
      imageFiles.map(async (file) => ({
        fileName: file.name || `testimonial-${Date.now()}.jpg`,
        mimeType: file.type,
        size: file.size,
        image: new Uint8Array(await file.arrayBuffer()),
      })),
    );

    const testimonial = await prisma.testimonial.create({
      data: {
        bookingId: bookingPayment.booking.id,
        isPublished: false,
        name,
        avatar: null,
        role,
        text,
        rating,
        images: {
          create: imageCreates,
        },
      },
      include: {
        images: {
          select: {
            id: true,
            fileName: true,
            mimeType: true,
            size: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    return NextResponse.json(
      {
        data: {
          testimonial: normalizeTestimonialPayload(testimonial),
        },
        status: "success",
        message: "Testimoni berhasil dikirim. Menunggu moderasi admin.",
      },
      { status: 201 },
    );
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
