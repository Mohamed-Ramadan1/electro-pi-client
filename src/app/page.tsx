import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/home/hero-section";
import { FeaturesSection } from "@/components/marketing/home/features-section";
import { CtaSection } from "@/components/marketing/home/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
