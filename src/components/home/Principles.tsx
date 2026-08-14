"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import { principles } from "@/lib/data";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";

/**
 * Pinned values sequence. Each principle is built up over the previous one:
 * the panel rises like a slab being poured, then its detail cards stack in.
 */
export function Principles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".principle-panel");
      gsap.set(panels.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          onUpdate: (self) => {
            setActive(
              Math.min(
                principles.length - 1,
                Math.floor(self.progress * 0.999 * principles.length),
              ),
            );
          },
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;
        const image = panel.querySelector(".principle-image");
        const cards = panel.querySelectorAll(".principle-card");
        const index0 = index - 1;

        tl.to(
          panel,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "luxe" },
          index0,
        )
          .fromTo(
            image,
            { scale: 1.26, yPercent: 6 },
            { scale: 1, yPercent: 0, duration: 1.2, ease: "silk" },
            index0,
          )
          .fromTo(
            cards,
            { yPercent: 30, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.55,
              stagger: 0.06,
              ease: "drape",
            },
            index0 + 0.42,
          );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="principles"
      ref={wrapRef}
      className="relative h-[420vh] bg-void"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {principles.map((principle, index) => (
          <div
            key={principle.slug}
            className="principle-panel absolute inset-0 grid grid-cols-1 bg-void lg:grid-cols-[1.05fr_0.95fr]"
            style={{ zIndex: index + 1 }}
          >
            <div className="relative hidden h-full overflow-hidden lg:block">
              <div className="principle-image absolute inset-0">
                <Image
                  src={principle.image}
                  alt={principle.name}
                  fill
                  sizes="55vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,18,18,0.35),rgba(18,18,18,0.1)_45%,rgba(18,18,18,0.9))]" />
              <div className="blueprint-grid-fine absolute inset-0 opacity-50" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <span className="text-[11px] uppercase tracking-[0.4em] text-bronze">
                  {principle.index}
                </span>
                <Hoverable>
                  <button
                    data-magnetic
                    className="group font-display text-6xl uppercase text-ivory xl:text-7xl"
                  >
                    {principle.name}
                    <span className="mx-auto mt-5 block h-px w-0 bg-bronze transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-full" />
                  </button>
                </Hoverable>
                <p className="max-w-sm text-center font-accent text-lg italic text-cream/70">
                  {principle.statement}
                </p>
              </div>
            </div>

            <div className="relative flex h-full flex-col justify-between px-[var(--offset-x)] py-[calc(var(--header-height)+16px)] lg:py-24">
              <div className="lg:hidden">
                <span className="text-[11px] uppercase tracking-[0.4em] text-bronze">
                  {principle.index}
                </span>
                <p className="mt-2 font-display text-4xl uppercase text-ivory">
                  {principle.name}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">
                  {principle.proof}
                </p>
                <RevealText
                  scroll={false}
                  delay={0.1}
                  className="mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base"
                >
                  {principle.description}
                </RevealText>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                {principle.points.map((point) => (
                  <article
                    key={point.name}
                    className="principle-card group border-t border-champagne/12 pt-4"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <h3 className="text-[12px] uppercase tracking-[0.22em] text-ivory">
                        {point.name}
                      </h3>
                      <span className="h-px flex-1 origin-right scale-x-0 bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
                    </div>
                    <p className="mt-2 max-w-md text-[12px] leading-relaxed text-cream/55">
                      {point.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="relative mt-10 hidden h-28 overflow-hidden sm:block lg:h-36">
                <Image
                  src={principle.detailImage}
                  alt={`${principle.name} detail`}
                  fill
                  sizes="45vw"
                  className="object-cover opacity-55"
                />
                <span className="facade-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-ivory/12 to-transparent" />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-[var(--offset-bottom)] left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 sm:gap-9">
          {principles.map((item, index) => (
            <span
              key={item.slug}
              className="relative text-[10px] uppercase tracking-[0.26em] transition-colors duration-500 sm:text-[11px]"
              style={{
                color: index === active ? "#fbf7f0" : "rgba(236,231,222,0.35)",
              }}
            >
              {item.name}
              <span
                className="absolute -bottom-2 left-0 h-px w-full origin-left bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ transform: `scaleX(${index === active ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
