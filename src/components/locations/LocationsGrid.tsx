"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { locations } from "@/lib/data";
import { PortalFrame } from "@/components/ui/PortalFrame";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { useUI } from "@/components/providers/AppProviders";

export function LocationsGrid() {
  const { setReserveOpen } = useUI();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".location-card").forEach((card) => {
        gsap.from(card.querySelectorAll(".location-meta > *"), {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.06,
          ease: "drape",
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="site-offset grid gap-x-8 gap-y-24 pb-32 sm:grid-cols-2 xl:grid-cols-3"
    >
      {locations.map((loc) => (
        <article key={loc.id} className="location-card group">
          <PortalFrame
            src={loc.image}
            alt={loc.name}
            shape={loc.shape}
            className="aspect-[4/5] w-full"
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
          <div className="location-meta mt-7">
            <div className="flex items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">
                {loc.codeName}
              </p>
              {loc.isNew ? (
                <span className="text-[10px] uppercase tracking-[0.2em] text-ivory">
                  New
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 font-display text-4xl italic text-ivory">
              {loc.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              {loc.address}
              <br />
              ({loc.metro})
            </p>
            <dl className="mt-5 space-y-1 text-xs text-cream/50">
              <div>Phone: {loc.phone}</div>
              <div>Telegram: {loc.telegram}</div>
              <div>Working hours: {loc.hours}</div>
            </dl>
            <div className="mt-6">
              <ChampagneButton magnetic onClick={() => setReserveOpen(true)}>
                Reserve
              </ChampagneButton>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
