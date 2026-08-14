"use client";

import { useEffect, useRef } from "react";
import { Draggable, gsap, registerMotion } from "@/lib/motion";
import { projects } from "@/lib/data";
import { PortalFrame } from "@/components/ui/PortalFrame";
import { BronzeButton } from "@/components/ui/BronzeButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useUI } from "@/components/providers/AppProviders";

/**
 * Draggable collection slider with inertia. Cards lean into the direction of
 * travel so the drag carries some weight.
 */
export function CollectionRail() {
  const { setEnquiryOpen } = useUI();
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
        const range = Math.abs(getBounds().minX) || 1;
        const progress = gsap.utils.clamp(0, 1, Math.abs(this.x) / range);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }

        const velocity = this.x - lastX;
        lastX = this.x;
        skewTo(gsap.utils.clamp(-8, 8, -velocity * 0.2));
        scaleTo(1 - Math.min(Math.abs(velocity) * 0.004, 0.055));
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
        yPercent: 12,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.08,
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
    <section id="collection" className="overflow-hidden bg-void pb-20 pt-28">
      <div className="site-offset mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">
            The collection
          </p>
          <RevealText
            as="h2"
            className="mt-4 font-display text-3xl uppercase leading-[1.1] text-ivory sm:text-5xl"
          >
            Addresses in the making
          </RevealText>
        </div>
        <Hoverable>
          <TransitionLink
            href="/collection"
            className="link-underline shrink-0 text-[11px] uppercase tracking-[0.28em] text-cream/70"
          >
            All developments
          </TransitionLink>
        </Hoverable>
      </div>

      <div ref={containerRef} className="relative">
        <div
          ref={trackRef}
          data-cursor-label="Drag"
          className="flex cursor-none gap-6 px-[var(--offset-x)] pb-8 will-change-transform"
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="rail-card group w-[78vw] shrink-0 sm:w-[360px]"
            >
              <Hoverable>
                <TransitionLink href="/collection" className="block">
                  <PortalFrame
                    src={project.portrait}
                    alt={project.name}
                    shape={project.shape}
                    className="aspect-[3/4] w-full"
                    sizes="360px"
                  />
                </TransitionLink>
              </Hoverable>

              <div className="mt-5 flex items-center gap-3">
                <span className="text-[11px] tracking-[0.24em] text-bronze">
                  {project.code}
                </span>
                <span className="h-px flex-1 bg-champagne/15" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
                  {project.status}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl uppercase text-ivory">
                {project.name}
              </h3>
              <p className="mt-2 font-accent text-lg italic text-cream/60">
                {project.typology}
              </p>
              <p className="mt-3 text-sm text-cream/50">
                {project.address}, {project.city}
              </p>
              <p className="mt-1 text-xs text-cream/40">{project.scale}</p>
              <div className="mt-5">
                <BronzeButton onClick={() => setEnquiryOpen(true)}>
                  Enquire
                </BronzeButton>
              </div>
            </article>
          ))}
        </div>

        <div className="site-offset mt-4 flex items-center gap-6">
          <span className="relative h-px flex-1 bg-champagne/15">
            <span
              ref={progressRef}
              className="absolute inset-0 origin-left scale-x-0 bg-bronze"
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
