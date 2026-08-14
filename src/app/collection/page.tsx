import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/collection/ProjectsGrid";
import { RevealText } from "@/components/motion/RevealText";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: `The Collection | ${site.name}`,
  description:
    "Residences, workplaces and mixed-use precincts across Mumbai, Pune, Alibaug and Nashik.",
};

export default function CollectionPage() {
  return (
    <div className="relative min-h-screen bg-void pt-[calc(var(--header-height)+48px)]">
      <div className="blueprint-grid pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-40" />

      <header className="site-offset relative mb-20">
        <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
          {site.name} — {site.tagline}
        </p>
        <RevealText
          as="h1"
          type="chars"
          stagger={0.03}
          scroll={false}
          delay={0.15}
          className="mt-5 font-display text-4xl uppercase leading-[1.05] text-ivory sm:text-7xl"
        >
          The Collection
        </RevealText>
        <RevealText
          scroll={false}
          delay={0.35}
          className="mt-7 max-w-xl text-sm leading-relaxed text-cream/65 sm:text-base"
        >
          A portfolio shaped by legacy and guided by vision. Every development
          here reflects the same way of building — clear title, published
          programme, and specifications that do not move after booking.
        </RevealText>
      </header>

      <ProjectsGrid />
    </div>
  );
}
