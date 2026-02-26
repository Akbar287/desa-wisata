import Navbar from "@/components/layouts/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TripTypesSection from "@/components/TripTypesSection";
import TopToursSection from "@/components/TopToursSection";
import TravelGuideSection from "@/components/TravelGuideSection";
import WhyWithUsSection from "@/components/WhyWithUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/layouts/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <TripTypesSection />
        <TopToursSection />
        <TravelGuideSection />
        <WhyWithUsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
