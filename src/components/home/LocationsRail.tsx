"use client";

import { useEffect, useRef } from "react";
import { Draggable, gsap, registerMotion } from "@/lib/motion";
import { locations } from "@/lib/data";
import { PortalFrame } from "@/components/ui/PortalFrame";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useUI } from "@/components/providers/AppProviders";

/**
 * Draggable locations slider with inertia. Cards skew toward the direction of
 * travel, which is what sells the weight of the drag on the reference site.
 */
export function LocationsRail() {
  const { setReserveOpen } = useUI();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".rail-card");
      const skewTo = gsap.quickTo(cards, "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      const scaleTo = gsap.quickTo(cards, "scaleY", {
        duration: 0.5,
        ease: "power3.out",
      });

      const getBounds = () => ({
        minX: Math.min(0, container.offsetWidth - track.scrollWidth - 32),
        maxX: 0,
      });

      let lastX = 0;

      const update = function (this: Draggable) {
        const bounds = getBounds();
        const range = Math.abs(bounds.minX) || 1;
        const progress = gsap.utils.clamp(0, 1, Math.abs(this.x) / range);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }

        const velocity = this.x - lastX;
        lastX = this.x;
        skewTo(gsap.utils.clamp(-9, 9, -velocity * 0.22));
        scaleTo(1 - Math.min(Math.abs(velocity) * 0.004, 0.06));
      };

      const settle = () => {
        skewTo(0);
        scaleTo(1);
      };

      const [drag] = Draggable.create(track, {
        type: "x",
        inertia: true,
        edgeResistance: 0.92,
        dragResistance: 0.05,
        bounds: getBounds(),
        allowNativeTouchScrolling: true,
        onDrag: update,
        onThrowUpdate: update,
        onDragEnd: settle,
        onThrowComplete: settle,
      });

      gsap.from(cards, {
        yPercent: 14,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "drape",
        scrollTrigger: { trigger: container, start: "top 82%", once: true },
      });

      const onResize = () => drag.applyBounds(getBounds());
      window.addEventListener("resize", onResize);

      return () => {
        drag.kill();
        window.removeEventListener("resize", onResize);
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden bg-void pb-20 pt-24">
      <div className="site-offset mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">
            Locations
          </p>
          <RevealText
            as="h2"
            type="chars"
            stagger={0.03}
            className="mt-3 font-display text-4xl italic text-ivory sm:text-6xl"
          >
            Portals of taste
          </RevealText>
        </div>
        <Hoverable>
          <TransitionLink
            href="/locations"
            className="link-underline shrink-0 text-[11px] uppercase tracking-[0.28em] text-cream/70"
          >
            View all
          </TransitionLink>
        </Hoverable>
      </div>

      <div ref={containerRef} className="relative">
        <div
          ref={trackRef}
          data-cursor-label="Drag"
          className="flex cursor-none gap-6 px-[var(--offset-x)] pb-8 will-change-transform"
        >
          {locations.map((loc) => (
            <article
              key={loc.id}
              className="rail-card group w-[76vw] shrink-0 sm:w-[340px]"
            >
              <Hoverable>
                <TransitionLink href="/locations" className="block">
                  <PortalFrame
                    src={loc.portrait}
                    alt={loc.name}
                    shape={loc.shape}
                    className="aspect-[3/4] w-full"
                    sizes="340px"
                  />
                </TransitionLink>
              </Hoverable>
              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">
                {loc.codeName}
                {loc.isNew ? <span className="ml-3 text-ivory">New</span> : null}
              </p>
              <h3 className="mt-1 font-display text-3xl italic text-ivory">
                {loc.name}
              </h3>
              <p className="mt-2 text-sm text-cream/55">
                {loc.address} ({loc.metro})
              </p>
              <div className="mt-4">
                <ChampagneButton onClick={() => setReserveOpen(true)}>
                  Reserve
                </ChampagneButton>
              </div>
            </article>
          ))}
        </div>

        <div className="site-offset mt-4 flex items-center gap-6">
          <span className="relative h-px flex-1 bg-champagne/15">
            <span
              ref={progressRef}
              className="absolute inset-0 origin-left scale-x-0 bg-champagne"
            />
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
            Drag
          </span>
        </div>
      </div>
    </section>
  );
}
