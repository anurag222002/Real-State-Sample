import type { Metadata } from "next";
import { LocationsGrid } from "@/components/locations/LocationsGrid";
import { RevealText } from "@/components/motion/RevealText";

export const metadata: Metadata = {
  title: "Locations | TIMELESS Luxury Lounges",
  description: "Lounges designed by the people and for the people.",
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-void pt-[calc(var(--header-height)+40px)]">
      <header className="site-offset mb-20">
        <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
          TIMELESS
        </p>
        <RevealText
          as="h1"
          type="chars"
          stagger={0.035}
          scroll={false}
          delay={0.15}
          className="mt-4 font-display text-5xl font-light italic text-ivory sm:text-8xl"
        >
          All locations
        </RevealText>
        <RevealText
          scroll={false}
          delay={0.35}
          className="mt-6 max-w-lg text-sm leading-relaxed text-cream/65 sm:text-base"
        >
          Lounges designed by the people and for the people.
        </RevealText>
      </header>
      <LocationsGrid />
    </div>
  );
}
