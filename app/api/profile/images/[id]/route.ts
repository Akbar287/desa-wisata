import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const image = await prisma.profileGallery.findUnique({
    where: { id: Number(id) },
  })

  if (!image) return new Response("Not found", { status: 404 })

  return new Response(image.image, {
    headers: {
      "Content-Type": image.mimeType,
    },
  })
}