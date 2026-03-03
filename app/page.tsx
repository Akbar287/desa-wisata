import HeroSection from "@/components/landing-page/HeroSection";
import StatsSection from "@/components/landing-page/StatsSection";
import TopToursSection from "@/components/landing-page/TopToursSection";
import TripTypesSection from "@/components/landing-page/TripTypesSection";
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
import type { MonthlyRevenue, PopularTour, BookingStatusData } from "@/components/layouts/chart-area-interactive";
import WahanaSection from "@/components/landing-page/WahanaSection";

async function getDashboardData() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalTours,
    totalDestinations,
    allBookings,
    thisMonthBookings,
    lastMonthBookings,
    bookingsByTour,
    bookingStatusCounts
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
      by: ['tourId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  // Revenue calculations
  const thisMonthRevenue = thisMonthBookings.reduce((s, b) => s + b.totalPrice, 0);
  const lastMonthRevenue = lastMonthBookings.reduce((s, b) => s + b.totalPrice, 0);
  const totalRevenue = allBookings.reduce((s, b) => s + b.totalPrice, 0);
  const revenueGrowth = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : thisMonthRevenue > 0 ? 100 : 0;

  const totalBookings = allBookings.length;
  const thisMonthBookingsCount = thisMonthBookings.length;
  const lastMonthBookingsCount = lastMonthBookings.length;
  const bookingGrowth = lastMonthBookingsCount > 0
    ? ((thisMonthBookingsCount - lastMonthBookingsCount) / lastMonthBookingsCount) * 100
    : thisMonthBookingsCount > 0 ? 100 : 0;

  // Monthly revenue chart data (last 12 months)
  const monthlyRevenue: MonthlyRevenue[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthName = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
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
  const tourIds = bookingsByTour.map((b) => b.tourId);
  const tours = tourIds.length > 0
    ? await prisma.tour.findMany({ where: { id: { in: tourIds } }, select: { id: true, title: true } })
    : [];
  const tourMap = new Map(tours.map((t) => [t.id, t.title]));
  const popularTours: PopularTour[] = bookingsByTour.map((b) => ({
    name: (tourMap.get(b.tourId) ?? 'Paket Wisata').length > 25
      ? (tourMap.get(b.tourId) ?? 'Paket Wisata').slice(0, 22) + '...'
      : tourMap.get(b.tourId) ?? 'Paket Wisata',
    bookings: b._count.id,
  }));

  // Booking status distribution
  const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Terkonfirmasi',
    CANCELLED: 'Dibatalkan',
    COMPLETED: 'Selesai',
  };
  const STATUS_COLORS: Record<string, string> = {
    PENDING: '#F59E0B',
    CONFIRMED: '#22C55E',
    CANCELLED: '#EF4444',
    COMPLETED: '#3B82F6',
  };
  const bookingStatus: BookingStatusData[] = bookingStatusCounts.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s._count.id,
    color: STATUS_COLORS[s.status] ?? '#6B7280',
  }));

  const stats: DashboardStats = {
    totalRevenue,
    totalBookings,
    totalTours,
    totalDestinations,
    revenueGrowth,
    bookingGrowth,
  };

  return { stats, monthlyRevenue, popularTours, bookingStatus };
}

export default async function Home() {
  const session = await getSession()

  if (session) {
    const { stats, monthlyRevenue, popularTours, bookingStatus } = await getDashboardData();
    return (
      <>
        <SiteHeader title="Dashboard — Desa Manuk Jaya" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  monthlyRevenue={monthlyRevenue}
                  popularTours={popularTours}
                  bookingStatus={bookingStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const [tours, testimonials, blogPosts, tourCount, testimonialCount, bookingCount, destinationCount] = await Promise.all([
    prisma.tour.findMany({
      take: 4,
      orderBy: { rating: 'desc' },
      select: {
        id: true, title: true, type: true, durationDays: true, price: true, image: true, rating: true, reviewCount: true,
        highlights: { select: { text: true }, orderBy: { order: 'asc' }, take: 4 },
      },
    }),
    prisma.testimonial.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, avatar: true, role: true, text: true, rating: true },
    }),
    prisma.blogPost.findMany({
      take: 6,
      orderBy: { date: 'desc' },
      select: { id: true, title: true, excerpt: true, image: true, date: true, category: true },
    }),
    prisma.tour.count(),
    prisma.testimonial.count(),
    prisma.booking.count(),
    prisma.destination.count(),
  ])

  const stats = {
    tourCount,
    testimonialCount,
    bookingCount,
    destinationCount,
  }

  const wahana = await prisma.wahana.findMany({
    take: 5,
    orderBy: { rating: 'desc' },
  })

  return (
    <>
      <HeroSection />
      <NatureOverlay>
        <StatsSection stats={stats} />
        <TripTypesSection />
        <TopToursSection tours={tours} />
        <TravelGuideSection posts={blogPosts} />
        <WhyWithUsSection />
        <WahanaSection wahana={wahana} />
        <TestimonialsSection testimonials={testimonials} />
      </NatureOverlay>
    </>
  );
}
