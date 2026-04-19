import HeroSection from "@/components/landing-page/HeroSection";
import StatsSection from "@/components/landing-page/StatsSection";
import TopToursSection from "@/components/landing-page/TopToursSection";
import WhyWithUsSection from "@/components/landing-page/WhyWithUsSection";
import TravelGuideSection from "@/components/landing-page/TravelGuideSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import NatureOverlay from "@/components/landing-page/NatureOverlay";
import { getSession } from "@/provider/api";
import { SiteHeader } from "@/components/layouts/site-header";
import { SectionCards } from "@/components/layouts/section-cards";
import { ChartAreaInteractive } from "@/components/layouts/chart-area-interactive";
import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/components/layouts/section-cards";
import type {
  MonthlyRevenue,
  PopularItem,
  BookingStatusData,
} from "@/components/layouts/chart-area-interactive";
import WahanaSection from "@/components/landing-page/WahanaSection";
import DestinationSection from "@/components/landing-page/DestinationSection";
import ProfilDesaSection from "@/components/landing-page/ProfilDesaSection";
import GallerySection from "@/components/landing-page/GallerySection";

async function getDashboardData() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
  );
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalTours,
    totalDestinations,
    allBookings,
    thisMonthBookings,
    lastMonthBookings,
    bookingsByTour,
    bookingsByDestination,
    bookingsByWahana,
    bookingStatusCounts,
  ] = await Promise.all([
    prisma.tour.count(),
    prisma.destination.count(),
    prisma.booking.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { totalPrice: true, createdAt: true, status: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: thisMonthStart } },
      select: { totalPrice: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      select: { totalPrice: true },
    }),
    prisma.booking.groupBy({
      by: ["tourId"],
      _count: { id: true },
      _sum: { adults: true, children: true, totalPrice: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.booking.groupBy({
      by: ["destinationId"],
      _count: { id: true },
      _sum: { adults: true, children: true, totalPrice: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.booking.groupBy({
      by: ["wahanaId"],
      _count: { id: true },
      _sum: { adults: true, children: true, totalPrice: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  // Revenue calculations
  const thisMonthRevenue = thisMonthBookings.reduce(
    (s, b) => s + b.totalPrice,
    0,
  );
  const lastMonthRevenue = lastMonthBookings.reduce(
    (s, b) => s + b.totalPrice,
    0,
  );
  const totalRevenue = allBookings.reduce((s, b) => s + b.totalPrice, 0);
  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0
        ? 100
        : 0;

  const totalBookings = allBookings.length;
  const thisMonthBookingsCount = thisMonthBookings.length;
  const lastMonthBookingsCount = lastMonthBookings.length;
  const bookingGrowth =
    lastMonthBookingsCount > 0
      ? ((thisMonthBookingsCount - lastMonthBookingsCount) /
        lastMonthBookingsCount) *
      100
      : thisMonthBookingsCount > 0
        ? 100
        : 0;

  // Monthly revenue chart data (last 12 months)
  const monthlyRevenue: MonthlyRevenue[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthName = d.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
    const monthBookings = allBookings.filter((b) => {
      const bd = new Date(b.createdAt);
      return bd >= d && bd <= monthEnd;
    });
    monthlyRevenue.push({
      month: monthName,
      pendapatan: monthBookings.reduce((s, b) => s + b.totalPrice, 0),
      pemesanan: monthBookings.length,
    });
  }

  // Popular tours (top 5)
  const validBookingsByTour = bookingsByTour.filter((b) => b.tourId !== null);
  const tourIds = validBookingsByTour.map((b) => b.tourId as number);
  const validBookingsByDestination = bookingsByDestination.filter(
    (b) => b.destinationId !== null,
  );
  const destinationIds = validBookingsByDestination.map(
    (b) => b.destinationId as number,
  );

  const validBookingsByWahana = bookingsByWahana.filter(
    (b) => b.wahanaId !== null,
  );
  const wahanaIds = validBookingsByWahana.map((b) => b.wahanaId as number);

  const [tours, destinations, wahanas] = await Promise.all([
    tourIds.length > 0
      ? prisma.tour.findMany({
        where: { id: { in: tourIds } },
        select: { id: true, title: true },
      })
      : Promise.resolve([]),
    destinationIds.length > 0
      ? prisma.destination.findMany({
        where: { id: { in: destinationIds } },
        select: { id: true, name: true },
      })
      : Promise.resolve([]),
    wahanaIds.length > 0
      ? prisma.wahana.findMany({
        where: { id: { in: wahanaIds } },
        select: { id: true, name: true },
      })
      : Promise.resolve([]),
  ]);

  const tourMap = new Map(tours.map((t) => [t.id, t.title]));
  const popularTours: PopularItem[] = validBookingsByTour.map((b) => ({
    name:
      (tourMap.get(b.tourId!) ?? "Paket Wisata").length > 25
        ? (tourMap.get(b.tourId!) ?? "Paket Wisata").slice(0, 22) + "..."
        : (tourMap.get(b.tourId!) ?? "Paket Wisata"),
    bookings: b._count.id,
    totalPax: Number(b._sum.adults ?? 0) + Number(b._sum.children ?? 0),
    totalRevenue: Number(b._sum.totalPrice ?? 0),
  }));

  const destinationMap = new Map(destinations.map((d) => [d.id, d.name]));
  const popularDestinations: PopularItem[] = validBookingsByDestination.map(
    (b) => ({
      name:
        (destinationMap.get(b.destinationId!) ?? "Destinasi").length > 25
          ? (destinationMap.get(b.destinationId!) ?? "Destinasi").slice(0, 22) +
          "..."
          : (destinationMap.get(b.destinationId!) ?? "Destinasi"),
      bookings: b._count.id,
      totalPax: Number(b._sum.adults ?? 0) + Number(b._sum.children ?? 0),
      totalRevenue: Number(b._sum.totalPrice ?? 0),
    }),
  );

  const wahanaMap = new Map(wahanas.map((w) => [w.id, w.name]));
  const popularWahanas: PopularItem[] = validBookingsByWahana.map((b) => ({
    name:
      (wahanaMap.get(b.wahanaId!) ?? "Wahana").length > 25
        ? (wahanaMap.get(b.wahanaId!) ?? "Wahana").slice(0, 22) + "..."
        : (wahanaMap.get(b.wahanaId!) ?? "Wahana"),
    bookings: b._count.id,
    totalPax: Number(b._sum.adults ?? 0) + Number(b._sum.children ?? 0),
    totalRevenue: Number(b._sum.totalPrice ?? 0),
  }));

  // Booking status distribution
  const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Terkonfirmasi",
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
  };
  const STATUS_COLORS: Record<string, string> = {
    PENDING: "#F59E0B",
    CONFIRMED: "#22C55E",
    CANCELLED: "#EF4444",
    COMPLETED: "#3B82F6",
  };
  const bookingStatus: BookingStatusData[] = bookingStatusCounts.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s._count.id,
    color: STATUS_COLORS[s.status] ?? "#6B7280",
  }));

  const stats: DashboardStats = {
    totalRevenue,
    totalBookings,
    totalTours,
    totalDestinations,
    revenueGrowth,
    bookingGrowth,
  };

  return {
    stats,
    monthlyRevenue,
    popularTours,
    popularDestinations,
    popularWahanas,
    bookingStatus,
  };
}

export default async function Home() {
  const session = await getSession();

  if (session) {
    const {
      stats,
      monthlyRevenue,
      popularTours,
      popularDestinations,
      popularWahanas,
      bookingStatus,
    } = await getDashboardData();
    return (
      <>
        <SiteHeader title="Dashboard — Desa Manud Jaya" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  monthlyRevenue={monthlyRevenue}
                  popularTours={popularTours}
                  popularDestinations={popularDestinations}
                  popularWahanas={popularWahanas}
                  bookingStatus={bookingStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const [
    tours,
    testimonials,
    blogPosts,
    tourCount,
    testimonialCount,
    bookingCount,
    destinationCount,
    landingPageStatistics,
    landingPageWithUs,
    profile,
  ] = await Promise.all([
    prisma.tour.findMany({
      take: 4,
      orderBy: { rating: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        durationDays: true,
        price: true,
        image: true,
        heroImage: true,
        createdAt: true,
        rating: true,
        reviewCount: true,
        gallery: {
          select: { id: true, image: true, order: true },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
        highlights: {
          select: { text: true },
          orderBy: { order: "asc" },
          take: 4,
        },
      },
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        text: true,
        rating: true,
      },
    }),
    prisma.blogPost.findMany({
      take: 6,
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        image: true,
        date: true,
        category: true,
      },
    }),
    prisma.tour.count(),
    prisma.testimonial.count(),
    prisma.booking.count(),
    prisma.destination.count(),
    prisma.landingPageStatistic.findMany({
      orderBy: { order: "asc" },
      select: { id: true, title: true, count: true, image: true, order: true },
    }),
    prisma.landingPageWithUs.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        order: true,
      },
    }),
    prisma.villageProfile.findFirst({
      include: {
        visions: {
          select: { text: true, order: true },
          orderBy: { order: "asc" },
        },
        missions: {
          select: { text: true, order: true },
          orderBy: { order: "asc" },
        },
        galleries: {
          select: { id: true },
          orderBy: { createdAt: "desc" },
        },
      },

    })
  ]);

  const stats = {
    tourCount,
    testimonialCount,
    bookingCount,
    destinationCount,
  };

  const wahana = await prisma.wahana.findMany({
    take: 5,
    orderBy: { rating: "desc" },
    include: {
      WahanaGallery: {
        select: { id: true, image: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  const destinations = await prisma.destination.findMany({
    where: { isAktif: true },
    take: 8,
    orderBy: { reviewCount: "desc" },
    include: {
      destinationLabels: { include: { label: { select: { name: true } } } },
      destinationFacilities: {
        include: { facility: { select: { name: true } } },
      },
      destinationGalleries: {
        select: { id: true, image: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  const destinationsSerialized = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    imageBanner: d.imageBanner,
    description: d.description,
    priceWeekday: d.priceWeekday,
    jamBuka: d.jamBuka,
    jamTutup: d.jamTutup,
    labels: d.destinationLabels.map((dl) => dl.label.name),
    facilities: d.destinationFacilities.map((df) => df.facility.name),
  }));

  type GalleryPreviewItem = {
    id: string;
    image: string;
    title: string;
    href: string;
    label: string;
    sortAt: number;
  };

  const rawGalleryPreview: GalleryPreviewItem[] = [];
  const uniqueImageKey = new Set<string>();

  const pushGalleryImage = (item: GalleryPreviewItem) => {
    const key = `${item.id}-${item.image}`;
    if (uniqueImageKey.has(key)) return;
    uniqueImageKey.add(key);
    rawGalleryPreview.push(item);
  };

  destinations.forEach((item) => {
    if (item.imageBanner) {
      pushGalleryImage({
        id: `destination-${item.id}-banner`,
        image: item.imageBanner,
        title: item.name,
        href: `/destinations/${item.id}`,
        label: "Destinasi",
        sortAt: item.createdAt.getTime(),
      });
    }

    item.destinationGalleries.forEach((gallery) => {
      if (!gallery.image) return;
      pushGalleryImage({
        id: `destination-${item.id}-gallery-${gallery.id}`,
        image: gallery.image,
        title: item.name,
        href: `/destinations/${item.id}`,
        label: "Destinasi",
        sortAt: gallery.createdAt.getTime(),
      });
    });
  });

  wahana.forEach((item) => {
    if (item.imageBanner) {
      pushGalleryImage({
        id: `wahana-${item.id}-banner`,
        image: item.imageBanner,
        title: item.name,
        href: `/wahana/${item.id}`,
        label: "Wahana",
        sortAt: item.createdAt.getTime(),
      });
    }

    item.WahanaGallery.forEach((gallery) => {
      if (!gallery.image) return;
      pushGalleryImage({
        id: `wahana-${item.id}-gallery-${gallery.id}`,
        image: gallery.image,
        title: item.name,
        href: `/wahana/${item.id}`,
        label: "Wahana",
        sortAt: gallery.createdAt.getTime(),
      });
    });
  });

  tours.forEach((item) => {
    if (item.image) {
      pushGalleryImage({
        id: `tour-${item.id}-cover`,
        image: item.image,
        title: item.title,
        href: `/tours/${item.id}`,
        label: "Tour",
        sortAt: item.createdAt.getTime(),
      });
    }

    if (item.heroImage) {
      pushGalleryImage({
        id: `tour-${item.id}-hero`,
        image: item.heroImage,
        title: item.title,
        href: `/tours/${item.id}`,
        label: "Tour",
        sortAt: item.createdAt.getTime(),
      });
    }

    item.gallery.forEach((gallery) => {
      if (!gallery.image) return;
      pushGalleryImage({
        id: `tour-${item.id}-gallery-${gallery.id}`,
        image: gallery.image,
        title: item.title,
        href: `/tours/${item.id}`,
        label: "Tour",
        sortAt: item.createdAt.getTime(),
      });
    });
  });

  const galleryPreview = rawGalleryPreview
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      image: item.image,
      title: item.title,
      href: item.href,
      label: item.label,
    }));

  const galleryImages = profile?.galleries.map(
    (g) => `/api/profile/images/${g.id}`
  ) || [];

  return (
    <>
      <HeroSection />
      <NatureOverlay>
        <ProfilDesaSection
          profile={profile} />
        <StatsSection
          stats={stats}
          landingPageStatistics={landingPageStatistics}
        />
        <DestinationSection destinations={destinationsSerialized} />
        <WahanaSection wahana={wahana} />
        <TopToursSection tours={tours} />
        <WhyWithUsSection reasons={landingPageWithUs} />
        <TravelGuideSection posts={blogPosts} />
        <GallerySection items={galleryPreview} />
        <TestimonialsSection testimonials={testimonials} />
      </NatureOverlay>
    </>
  );
}
