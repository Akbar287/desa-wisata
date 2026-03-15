import { prisma } from "@/lib/prisma";
import type {
  GalleryItem,
  GalleryPageData,
  GalleryQuery,
} from "@/types/GalleryTypes";

function normalizeText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildContent(
  value: string | null | undefined,
  fallback: string,
): string {
  const text = normalizeText(value);
  if (text.length > 0) return text;
  return fallback;
}

function toIso(value: Date): string {
  return value.toISOString();
}

function pushUniqueImage(
  items: GalleryItem[],
  seen: Set<string>,
  item: GalleryItem,
): void {
  const key = `${item.type}-${item.entityId}-${item.image}`;
  if (seen.has(key)) return;
  seen.add(key);
  items.push(item);
}

export async function getGalleryPageData({
  page,
  limit,
}: GalleryQuery): Promise<GalleryPageData> {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 12;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const [destinations, wahanas, tours] = await Promise.all([
    prisma.destination.findMany({
      where: { isAktif: true },
      select: {
        id: true,
        name: true,
        imageBanner: true,
        description: true,
        createdAt: true,
        destinationGalleries: {
          select: {
            id: true,
            image: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.wahana.findMany({
      select: {
        id: true,
        name: true,
        imageBanner: true,
        description: true,
        createdAt: true,
        WahanaGallery: {
          select: {
            id: true,
            image: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        heroImage: true,
        overview: true,
        createdAt: true,
        gallery: {
          select: {
            id: true,
            image: true,
            order: true,
          },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
      },
    }),
  ]);

  const destinationItems: GalleryItem[] = [];
  destinations.forEach((item) => {
    const seen = new Set<string>();
    const content = buildContent(
      item.description,
      `Galeri destinasi ${item.name}.`,
    );
    const href = `/destinations/${item.id}`;

    if (item.imageBanner) {
      pushUniqueImage(destinationItems, seen, {
        id: `destination-${item.id}-banner`,
        entityId: item.id,
        type: "destination",
        name: item.name,
        title: `Foto Destinasi ${item.name}`,
        content,
        image: item.imageBanner,
        href,
        createdAt: toIso(item.createdAt),
      });
    }

    item.destinationGalleries.forEach((gallery) => {
      if (!gallery.image) return;
      pushUniqueImage(destinationItems, seen, {
        id: `destination-${item.id}-gallery-${gallery.id}`,
        entityId: item.id,
        type: "destination",
        name: item.name,
        title: `Galeri Destinasi ${item.name}`,
        content,
        image: gallery.image,
        href,
        createdAt: toIso(gallery.createdAt),
      });
    });
  });

  const wahanaItems: GalleryItem[] = [];
  wahanas.forEach((item) => {
    const seen = new Set<string>();
    const content = buildContent(
      item.description,
      `Galeri wahana ${item.name}.`,
    );
    const href = `/wahana/${item.id}`;

    if (item.imageBanner) {
      pushUniqueImage(wahanaItems, seen, {
        id: `wahana-${item.id}-banner`,
        entityId: item.id,
        type: "wahana",
        name: item.name,
        title: `Foto Wahana ${item.name}`,
        content,
        image: item.imageBanner,
        href,
        createdAt: toIso(item.createdAt),
      });
    }

    item.WahanaGallery.forEach((gallery) => {
      if (!gallery.image) return;
      pushUniqueImage(wahanaItems, seen, {
        id: `wahana-${item.id}-gallery-${gallery.id}`,
        entityId: item.id,
        type: "wahana",
        name: item.name,
        title: `Galeri Wahana ${item.name}`,
        content,
        image: gallery.image,
        href,
        createdAt: toIso(gallery.createdAt),
      });
    });
  });

  const tourItems: GalleryItem[] = [];
  tours.forEach((item) => {
    const seen = new Set<string>();
    const content = buildContent(item.overview, `Galeri tour ${item.title}.`);
    const href = `/tours/${item.id}`;

    if (item.image) {
      pushUniqueImage(tourItems, seen, {
        id: `tour-${item.id}-cover`,
        entityId: item.id,
        type: "tour",
        name: item.title,
        title: `Foto Tour ${item.title}`,
        image: item.image,
        content,
        href,
        createdAt: toIso(item.createdAt),
      });
    }

    if (item.heroImage) {
      pushUniqueImage(tourItems, seen, {
        id: `tour-${item.id}-hero`,
        entityId: item.id,
        type: "tour",
        name: item.title,
        title: `Hero Tour ${item.title}`,
        image: item.heroImage,
        content,
        href,
        createdAt: toIso(item.createdAt),
      });
    }

    item.gallery.forEach((gallery) => {
      if (!gallery.image) return;
      pushUniqueImage(tourItems, seen, {
        id: `tour-${item.id}-gallery-${gallery.id}`,
        entityId: item.id,
        type: "tour",
        name: item.title,
        title: `Galeri Tour ${item.title}`,
        image: gallery.image,
        content,
        href,
        createdAt: toIso(item.createdAt),
      });
    });
  });

  const merged = [...destinationItems, ...wahanaItems, ...tourItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalItems = merged.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  const currentPage = Math.min(safePage, totalPages);
  const startIndex = (currentPage - 1) * safeLimit;
  const items = merged.slice(startIndex, startIndex + safeLimit);

  return {
    items,
    pagination: {
      page: currentPage,
      limit: safeLimit,
      totalItems,
      totalPages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages,
    },
  };
}
