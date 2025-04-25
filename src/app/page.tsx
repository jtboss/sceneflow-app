import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PromptDemo } from "@/components/landing/prompt-demo";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      
      {/* Visual Teaser Section */}
      <PromptDemo />
      
      {/* Direct CTA */}
      <CTA />
      <Footer />
    </main>
  );
}
