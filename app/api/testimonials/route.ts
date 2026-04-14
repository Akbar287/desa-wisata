import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prisma } from "@/lib/prisma";

const app = new Hono().basePath("/api/testimonials");

const MAX_IMAGE_SIZE_MB = 8;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function toFirstString(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? "");
  if (value === undefined || value === null) return "";
  return String(value);
}

function toFiles(value: unknown): File[] {
  if (Array.isArray(value)) return value.filter((v): v is File => v instanceof File);
  if (value instanceof File) return [value];
  return [];
}

function toImageUrl(id: number): string {
  return `/api/testimonials/images/${id}`;
}

app.get("/", async (c) => {
  try {
    const page = Math.max(1, Number(c.req.query("page") || "1"));
    const limit = Math.max(1, Math.min(50, Number(c.req.query("limit") || "10")));
    const search = (c.req.query("search") || "").trim();
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { text: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            select: { id: true, fileName: true, mimeType: true, size: true },
            orderBy: { id: "asc" },
          },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);
    const normalizedData = data.map((item) => ({
      ...item,
      images: item.images.map((img) => ({
        ...img,
        url: toImageUrl(img.id),
      })),
    }));
    const totalPages = Math.ceil(total / limit);
    return c.json({
      data: normalizedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      status: "success",
      message: "OK",
    });
  } catch (error) {
    return c.json(
      { data: [], pagination: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.get("/images/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) {
    return c.json({ data: null, status: "error", message: "ID gambar tidak valid" }, 400);
  }

  const image = await prisma.testimonialImage.findUnique({
    where: { id },
    select: {
      id: true,
      image: true,
      mimeType: true,
      fileName: true,
    },
  });

  if (!image) {
    return c.json({ data: null, status: "error", message: "Gambar tidak ditemukan" }, 404);
  }

  return c.body(image.image, 200, {
    "Content-Type": image.mimeType || "application/octet-stream",
    "Content-Disposition": `inline; filename="${image.fileName}"`,
    "Cache-Control": "public, max-age=3600",
  });
});

app.post("/submit", async (c) => {
  try {
    const body = await c.req.parseBody({ all: true });

    const bookingCode = toFirstString(body.bookingCode).trim().toUpperCase();
    const name = toFirstString(body.name).trim();
    const role = toFirstString(body.role).trim() || "Wisatawan";
    const text = toFirstString(body.text).trim();
    const rating = Number(toFirstString(body.rating));

    const imageFiles = [
      ...toFiles(body.images),
      ...toFiles((body as Record<string, unknown>)["images[]"]),
    ];

    if (!bookingCode) {
      return c.json(
        { data: null, status: "error", message: "Kode booking wajib diisi." },
        400,
      );
    }

    if (!name || name.length < 2) {
      return c.json({ data: null, status: "error", message: "Nama minimal 2 karakter." }, 400);
    }

    if (!text || text.length < 10) {
      return c.json(
        { data: null, status: "error", message: "Testimoni minimal 10 karakter." },
        400,
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return c.json(
        { data: null, status: "error", message: "Rating harus antara 1 hingga 5." },
        400,
      );
    }

    if (imageFiles.length < 1) {
      return c.json(
        { data: null, status: "error", message: "Upload foto minimal 1 gambar." },
        400,
      );
    }

    for (const image of imageFiles) {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(image.type)) {
        return c.json(
          {
            data: null,
            status: "error",
            message: "Format foto tidak didukung. Gunakan JPG/PNG/WebP/GIF.",
          },
          400,
        );
      }

      if (image.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return c.json(
          {
            data: null,
            status: "error",
            message: `Ukuran foto maksimal ${MAX_IMAGE_SIZE_MB}MB per file.`,
          },
          400,
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

    if (!bookingPayment) {
      return c.json(
        { data: null, status: "error", message: "Booking tidak ditemukan." },
        404,
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
      return c.json(
        {
          data: {
            testimonial: {
              id: existing.id,
              isPublished: existing.isPublished,
              name: existing.name,
              role: existing.role,
              text: existing.text,
              rating: existing.rating,
              createdAt: existing.createdAt,
              images: existing.images.map((img) => ({
                id: img.id,
                url: toImageUrl(img.id),
                fileName: img.fileName,
                mimeType: img.mimeType,
                size: img.size,
              })),
            },
          },
          status: "error",
          message: "Testimoni untuk booking ini sudah pernah dikirim.",
        },
        409,
      );
    }

    const imageCreates = await Promise.all(
      imageFiles.map(async (file) => ({
        fileName: file.name || `testimonial-${Date.now()}.jpg`,
        mimeType: file.type,
        size: file.size,
        image: Buffer.from(await file.arrayBuffer()),
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

    return c.json(
      {
        data: {
          testimonial: {
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
          },
        },
        status: "success",
        message: "Testimoni berhasil dikirim. Menunggu moderasi admin.",
      },
      201,
    );
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      500,
    );
  }
});

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const data = await prisma.testimonial.create({
      data: {
        name: body.name,
        avatar: body.avatar || null,
        role: body.role,
        text: body.text,
        rating: Number(body.rating),
        bookingId: Number(body.bookingId),
        isPublished: Boolean(body.isPublished ?? false),
      },
    });
    return c.json(
      { data, status: "success", message: "Testimoni berhasil ditambahkan" },
      { status: 201 },
    );
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.put("/", async (c) => {
  const id = Number(c.req.query("_id"));
  if (!id) return c.json({ data: null, status: "error", message: "ID wajib" }, { status: 400 });
  try {
    const body = await c.req.json();
    const data = await prisma.testimonial.update({
      where: { id },
      data: {
        name: body.name,
        avatar: body.avatar || null,
        role: body.role,
        text: body.text,
        rating: Number(body.rating),
        bookingId: Number(body.bookingId),
        isPublished:
          typeof body.isPublished === "boolean" ? body.isPublished : undefined,
      },
    });
    return c.json({ data, status: "success", message: "Testimoni berhasil diperbarui" });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.delete("/", async (c) => {
  const id = Number(c.req.query("_id"));
  if (!id) return c.json({ data: null, status: "error", message: "ID wajib" }, { status: 400 });
  try {
    await prisma.testimonial.delete({ where: { id } });
    return c.json({ data: null, status: "success", message: "Testimoni berhasil dihapus" });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
