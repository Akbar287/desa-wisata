import DestinationDetailComponents from "@/components/DestinationDetailComponents";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destId = Number(id);
  if (!destId || isNaN(destId)) notFound();

  const dest = await prisma.destination.findUnique({
    where: { id: destId },
    include: {
      destinationLabels: {
        include: { label: { select: { id: true, name: true, icon: true } } },
      },
      destinationAccessibilities: {
        include: {
          accessibility: {
            select: { id: true, name: true, icon: true, description: true },
          },
        },
      },
      destinationFacilities: {
        include: {
          facility: {
            select: { id: true, name: true, icon: true, description: true },
          },
        },
      },
      destinationGalleries: { orderBy: { createdAt: "desc" } },
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

  if (!dest) notFound();

  // Fetch related destinations (same labels, exclude current)
  const labelIds = dest.destinationLabels.map((dl) => dl.labelId);
  const relatedDests =
    labelIds.length > 0
      ? await prisma.destination.findMany({
          where: {
            id: { not: dest.id },
            isAktif: true,
            destinationLabels: { some: { labelId: { in: labelIds } } },
          },
          take: 3,
          orderBy: { rating: "desc" },
          select: {
            id: true,
            name: true,
            imageBanner: true,
            priceWeekday: true,
            rating: true,
            jamBuka: true,
            jamTutup: true,
          },
        })
      : [];

  const serialized = {
    id: dest.id,
    name: dest.name,
    imageBanner: dest.imageBanner,
    description: dest.description,
    priceWeekday: dest.priceWeekday,
    priceWeekend: dest.priceWeekend,
    priceGroup: dest.priceGroup,
    minimalGroup: dest.minimalGroup,
    jamBuka: dest.jamBuka,
    jamTutup: dest.jamTutup,
    durasiRekomendasi: dest.durasiRekomendasi,
    KuotaHarian: dest.KuotaHarian,
    rating: dest.rating,
    reviewCount: dest.reviewCount,
    isAktif: dest.isAktif,
    labels: dest.destinationLabels.map((dl) => ({
      name: dl.label.name,
      icon: dl.label.icon,
    })),
    accessibilities: dest.destinationAccessibilities.map((da) => ({
      name: da.accessibility.name,
      icon: da.accessibility.icon,
      description: da.accessibility.description,
    })),
    facilities: dest.destinationFacilities.map((df) => ({
      name: df.facility.name,
      icon: df.facility.icon,
      description: df.facility.description,
    })),
    gallery: dest.destinationGalleries.map((g) => g.image),
    maps: dest.maps.map((md) => ({
      id: md.map.id,
      title: md.map.title,
      content: md.map.content,
      image: md.map.image,
      icon: md.map.icon,
      lat: md.map.lat,
      lng: md.map.lng,
      fasilitas: md.map.fasilitas,
      order: md.order,
    })),
    createdAt: dest.createdAt.toISOString(),
    updatedAt: dest.updatedAt.toISOString(),
  };

  const relatedSerialized = relatedDests.map((r) => ({
    id: r.id,
    name: r.name,
    imageBanner: r.imageBanner,
    priceWeekday: r.priceWeekday,
    rating: r.rating,
    jamBuka: r.jamBuka,
    jamTutup: r.jamTutup,
  }));

  return (
    <DestinationDetailComponents
      destination={serialized}
      relatedDestinations={relatedSerialized}
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
