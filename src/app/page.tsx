"use client";

import { LayoutGroup } from "framer-motion";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { LogoIntro } from "@/components/intro/LogoIntro";
import { Header } from "@/components/nav/Header";
import { SidebarIndex } from "@/components/nav/SidebarIndex";
import { Spine } from "@/components/spine/Spine";
import Hero from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SiteProvider>
      <LayoutGroup>
        <LogoIntro />
        <Header />
        <SidebarIndex />
        <Spine />

        <main>
          <Hero />
          <AboutUs />
          <Services />
          <Pricing />
          <Contact />
        </main>
      </LayoutGroup>
    </SiteProvider>
  );
}
