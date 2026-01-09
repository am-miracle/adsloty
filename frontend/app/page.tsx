import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SocialProof } from "@/components/sections/social-proof";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
