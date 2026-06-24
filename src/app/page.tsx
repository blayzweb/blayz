"use client";

import { LayoutGroup } from "framer-motion";
import { SiteProvider, useSite } from "@/components/providers/SiteProvider";
import { LogoIntro } from "@/components/intro/LogoIntro";
import { Header } from "@/components/nav/Header";
import { SidebarIndex } from "@/components/nav/SidebarIndex";
import { Spine } from "@/components/spine/Spine";
import { Hero } from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { AboutToServicesTransition } from "@/components/ui/AboutToServicesTransition";
import { Services } from "@/components/sections/Services";
import { ServicesToPricingTransition } from "@/components/ui/ServicesToPricingTransition";
import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("@/components/sections/Pricing").then((mod) => mod.Pricing), {
  ssr: true,
});
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/sections/Footer").then((mod) => mod.Footer), {
  ssr: true,
});



function HomeContent() {
  const { introDone } = useSite();

  return (
    <>
      <LogoIntro />

      {/* Site container is visible behind the intro to allow the 3D canvas to show through during zoom-out. */}
      <div
        className={introDone ? "contents" : "pointer-events-none"}
        aria-hidden={!introDone}
      >
        <Header />
        <SidebarIndex />
        <Spine />

        <main>
          <h1 className="sr-only">Blayz | Web Design &amp; Development Studio Dubai, UAE</h1>
          <Hero />
          <AboutUs />
          <AboutToServicesTransition />
          <Services />
          <ServicesToPricingTransition />
          <Pricing />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <SiteProvider>
      <LayoutGroup>
        <HomeContent />
      </LayoutGroup>
    </SiteProvider>
  );
}
