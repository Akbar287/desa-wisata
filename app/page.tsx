import HeroSection from "@/components/landing-page/HeroSection";
import StatsSection from "@/components/landing-page/StatsSection";
import TopToursSection from "@/components/landing-page/TopToursSection";
import TripTypesSection from "@/components/landing-page/TripTypesSection";
import WhyWithUsSection from "@/components/landing-page/WhyWithUsSection";
import TravelGuideSection from "@/components/landing-page/TravelGuideSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";

export default function Home() {
  return (
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
