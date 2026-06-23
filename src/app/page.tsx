"use client";

import { LayoutGroup } from "framer-motion";
import { SiteProvider, useSite } from "@/components/providers/SiteProvider";
import { LogoIntro } from "@/components/intro/LogoIntro";
import { Header } from "@/components/nav/Header";
import { SidebarIndex } from "@/components/nav/SidebarIndex";
import { Spine } from "@/components/spine/Spine";
import { Hero } from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

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
          <Hero />
          <AboutUs />
          <Services />
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
