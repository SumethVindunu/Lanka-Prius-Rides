import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import DestinationsSection from "@/components/DestinationsSection";
import FleetSection from "@/components/FleetSection";
import BookingSection from "@/components/BookingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Scene3DWrapper from "@/components/Scene3DWrapper";

export default function Home() {
  return (
    <main className="relative">
      <Scene3DWrapper />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DestinationsSection />
      <FleetSection />
      <BookingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
