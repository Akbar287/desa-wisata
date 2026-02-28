import HeroSection from "@/components/landing-page/HeroSection";
import StatsSection from "@/components/landing-page/StatsSection";
import TopToursSection from "@/components/landing-page/TopToursSection";
import TripTypesSection from "@/components/landing-page/TripTypesSection";
import WhyWithUsSection from "@/components/landing-page/WhyWithUsSection";
import TravelGuideSection from "@/components/landing-page/TravelGuideSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import { getSession } from "@/provider/api";
import { SiteHeader } from "@/components/layouts/site-header";
import { SectionCards } from "@/components/layouts/section-cards";
import { ChartAreaInteractive } from "@/components/layouts/chart-area-interactive";

export default async function Home() {
  const session = await getSession()
  return session ? (
    <>
      <SiteHeader title="Desa Manuk Jaya" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            {/* <DataTable data={data} /> */}
          </div>
        </div>
      </div></>
  ) : (
    <>
      <HeroSection />
      <StatsSection />
      <TripTypesSection />
      <TopToursSection />
      <TravelGuideSection />
      <WhyWithUsSection />
      <TestimonialsSection />
    </>
  );
}
