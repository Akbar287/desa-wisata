import { prisma } from "@/lib/prisma";
import WahanaIdComponents from "@/components/WahanaIdComponents";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WahanaDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const wahana = await prisma.wahana.findUnique({
    where: { id: Number(id) },
    include: {
      WahanaGallery: true,
      maps: {
        orderBy: { order: "asc" },
        include: {
          map: {
            select: {
              id: true,
              title: true,
              content: true,
              image: true,
              icon: true,
              lat: true,
              lng: true,
              fasilitas: true,
            },
          },
        },
      },
    },
  });

  if (!wahana) {
    notFound();
  }
  const serializedWahana = {
    ...wahana,
    createdAt: wahana.createdAt.toISOString(),
    updatedAt: wahana.updatedAt.toISOString(),
    WahanaGallery: wahana.WahanaGallery.map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    })),
    maps: wahana.maps.map((mw) => ({
      id: mw.map.id,
      title: mw.map.title,
      content: mw.map.content,
      image: mw.map.image,
      icon: mw.map.icon,
      lat: mw.map.lat,
      lng: mw.map.lng,
      fasilitas: mw.map.fasilitas,
      order: mw.order,
    })),
  };

  return (
    <WahanaIdComponents
      wahana={serializedWahana}
      googleMapsApiKey={(
        process.env.NEXT_PUBLIC_GMAPS_API ??
        process.env.NEXT_GMAPS_API ??
        ""
      ).trim()}
      googleMapsMapId={(
        process.env.NEXT_PUBLIC_GMAPS_MAP_ID ??
        process.env.NEXT_GMAPS_MAP_ID ??
        ""
      ).trim()}
    />
  );
}
