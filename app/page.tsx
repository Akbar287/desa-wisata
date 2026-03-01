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

export default async function Home() {
  const session = await getSession()

  if (session) {
    return (
      <>
        <SiteHeader title="Desa Manuk Jaya" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
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

  return (
    <>
      <HeroSection />
      <NatureOverlay>
        <StatsSection stats={stats} />
        <TripTypesSection />
        <TopToursSection tours={tours} />
        <TravelGuideSection posts={blogPosts} />
        <WhyWithUsSection />
        <TestimonialsSection testimonials={testimonials} />
      </NatureOverlay>
    </>
  );
}
