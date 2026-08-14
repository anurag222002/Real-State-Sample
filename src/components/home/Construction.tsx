"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { phases } from "@/lib/data";
import { RevealText } from "@/components/motion/RevealText";

const FLOORS = 22;
const TOP_HEIGHT_M = 148;
const CRANE_BASE = 12;
const CRANE_TOP = 86;

/**
 * The build sequence. Scrolling pours the structure floor by floor: plates
 * stack, the crane climbs its mast, the survey dimension counts up in metres,
 * and each phase of the programme lights as its slice of work completes.
 */
export function Construction() {
  const wrapRef = useRef<HTMLElement>(null);
  const craneRef = useRef<HTMLDivElement>(null);
  const mastRef = useRef<HTMLSpanElement>(null);
  const dimRef = useRef<HTMLSpanElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const floors = gsap.utils.toArray<HTMLElement>(".floor-plate");
      const readouts = gsap.utils.toArray<HTMLElement>(".height-readout");

      gsap.set(floors, { transformOrigin: "center bottom" });

      // Draw the survey outline before anything is built on it.
      gsap.fromTo(
        ".site-outline path, .site-outline line",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 1.6,
          stagger: 0.08,
          ease: "luxe",
          scrollTrigger: { trigger: wrap, start: "top 70%", once: true },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            const built = gsap.utils.clamp(0, 1, self.progress / 0.88);
            const metres = Math.round(built * TOP_HEIGHT_M);

            readouts.forEach((el) => {
              el.textContent = metres.toString();
            });
            if (dimRef.current) {
              dimRef.current.style.transform = `scaleY(${built})`;
            }
            const craneAt = CRANE_BASE + built * (CRANE_TOP - CRANE_BASE);
            if (craneRef.current) {
              craneRef.current.style.bottom = `${craneAt}%`;
            }
            if (mastRef.current) {
              mastRef.current.style.height = `${craneAt - 8}%`;
            }

            setActivePhase(
              Math.min(
                phases.length - 1,
                Math.floor(self.progress * 0.999 * phases.length),
              ),
            );
          },
        },
      });

      floors.forEach((floor, index) => {
        const at = index * 0.055;
        tl.fromTo(
          floor,
          { scaleY: 0.1, autoAlpha: 0, yPercent: 30 },
          {
            scaleY: 1,
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.34,
            ease: "power3.out",
          },
          at,
        ).fromTo(
          floor.querySelector(".pour-line"),
          { scaleX: 0, autoAlpha: 1 },
          { scaleX: 1, autoAlpha: 0, duration: 0.32, ease: "power2.out" },
          at,
        );
      });

      // Crown and glazing arrive once the frame tops out.
      tl.fromTo(
        ".tower-crown",
        { autoAlpha: 0, yPercent: 60 },
        { autoAlpha: 1, yPercent: 0, duration: 0.4, ease: "power3.out" },
        FLOORS * 0.055,
      ).fromTo(
        ".tower-glass",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        FLOORS * 0.055,
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={wrapRef}
      className="relative h-[380vh] bg-graphite"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="blueprint-grid-fine pointer-events-none absolute inset-0 opacity-60" />

        <div className="site-offset relative grid h-full grid-cols-1 items-center gap-10 pb-10 pt-[calc(var(--header-height)+8px)] lg:grid-cols-[1fr_0.95fr] lg:pt-0">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
              How we build
            </p>
            <RevealText
              as="h2"
              className="mt-5 max-w-lg font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
            >
              One floor every seven days
            </RevealText>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/60">
              The programme is published before excavation begins, then tracked
              against slab cycles that never leave the critical path.
            </p>

            <ol className="mt-10 flex flex-col">
              {phases.map((phase, index) => {
                const isActive = index === activePhase;
                const isDone = index < activePhase;
                return (
                  <li
                    key={phase.code}
                    className="relative border-t border-champagne/12 py-4 transition-opacity duration-700"
                    style={{ opacity: isActive ? 1 : isDone ? 0.5 : 0.26 }}
                  >
                    <span
                      className="absolute left-0 top-0 h-px w-full origin-left bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                      style={{
                        transform: `scaleX(${isDone || isActive ? 1 : 0})`,
                      }}
                    />
                    <div className="flex items-baseline gap-5">
                      <span className="w-6 text-[11px] tracking-[0.2em] text-bronze">
                        {phase.code}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <h3 className="text-[13px] uppercase tracking-[0.22em] text-ivory">
                            {phase.name}
                          </h3>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
                            {phase.duration}
                          </span>
                        </div>
                        <p
                          className="mt-2 max-w-md overflow-hidden text-[12px] leading-relaxed text-cream/55 transition-all duration-700"
                          style={{
                            maxHeight: isActive ? 72 : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex items-center gap-4 lg:hidden">
              <span className="relative h-1 flex-1 overflow-hidden bg-champagne/12">
                <span
                  className="absolute inset-y-0 left-0 bg-bronze transition-[width] duration-500"
                  style={{
                    width: `${((activePhase + 1) / phases.length) * 100}%`,
                  }}
                />
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/50">
                <span className="height-readout">0</span> m
              </span>
            </div>
          </div>

          <div className="relative hidden h-[80%] w-full lg:block">
            <svg
              className="site-outline pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 400 600"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M70 552 L70 128 L200 68 L330 128 L330 552"
                stroke="rgba(216,208,194,0.26)"
                strokeWidth="1"
              />
              <line
                x1="16"
                y1="552"
                x2="384"
                y2="552"
                stroke="rgba(179,139,91,0.7)"
                strokeWidth="1"
              />
              <line
                x1="70"
                y1="128"
                x2="330"
                y2="128"
                stroke="rgba(216,208,194,0.16)"
                strokeWidth="1"
              />
              <line
                x1="200"
                y1="44"
                x2="200"
                y2="552"
                stroke="rgba(216,208,194,0.12)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
            </svg>

            {/* Survey dimension rail, filling as the tower gains height. */}
            <div className="absolute bottom-[8%] left-0 top-[6%] w-12">
              <span className="absolute inset-y-0 left-6 w-px bg-champagne/15" />
              <span
                ref={dimRef}
                className="absolute bottom-0 left-6 h-full w-px origin-bottom scale-y-0 bg-bronze"
              />
              <span className="absolute bottom-0 left-3 h-px w-6 bg-bronze" />
              <span className="absolute left-3 top-0 h-px w-6 bg-champagne/40" />
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] text-cream/45 [writing-mode:vertical-rl]">
                <span className="height-readout">0</span> m
              </span>
            </div>

            {/* The tower itself. */}
            <div className="absolute inset-y-0 left-1/2 w-[54%] -translate-x-1/2">
              <div className="tower-glass absolute inset-x-0 bottom-[8%] top-[10%] bg-[linear-gradient(to_bottom,rgba(232,199,154,0.12),transparent_65%)] opacity-0" />

              <div className="absolute inset-x-0 bottom-[8%] top-[10%] flex flex-col-reverse">
                {Array.from({ length: FLOORS }).map((_, i) => (
                  <div
                    key={i}
                    className="floor-plate relative min-h-0 flex-1 border-t border-champagne/18 bg-[linear-gradient(to_right,rgba(58,54,49,0.92),rgba(42,39,36,0.7))]"
                  >
                    <span className="absolute inset-y-0 left-[18%] w-px bg-void/55" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-void/55" />
                    <span className="absolute inset-y-0 left-[82%] w-px bg-void/55" />
                    <span className="pour-line absolute inset-x-0 top-0 h-px origin-left bg-bronze" />
                  </div>
                ))}
              </div>

              <div className="tower-crown absolute inset-x-[16%] top-[10%] h-5 -translate-y-full border-x border-t border-champagne/25 opacity-0" />

              <span className="absolute inset-x-0 bottom-[8%] h-px bg-bronze/70" />
              <span className="absolute inset-x-[-14%] bottom-0 h-[8%] bg-[linear-gradient(to_bottom,rgba(42,39,36,0.85),rgba(18,18,18,0.15))]" />
            </div>

            {/* Climbing tower crane: mast, jib, counter-jib and hook. */}
            <span
              ref={mastRef}
              className="absolute bottom-[8%] left-[30%] w-px bg-champagne/25"
              style={{ height: "4%" }}
            />
            <div
              ref={craneRef}
              className="absolute left-[30%] right-[4%] bottom-[12%]"
            >
              <div className="relative h-px w-full bg-champagne/50">
                <span className="absolute -top-[3px] left-0 h-1.5 w-1.5 border border-champagne/70" />
                <span className="absolute -top-6 left-0 h-6 w-px bg-champagne/45" />
                <span className="absolute -top-6 left-0 w-[46%] origin-left rotate-[7deg] border-t border-champagne/25" />
                <span className="absolute -top-6 -left-[14%] w-[14%] origin-right -rotate-[9deg] border-t border-champagne/25" />
                <span className="absolute -left-[16%] -top-1 h-2 w-[8%] bg-champagne/30" />
                <span className="absolute left-[68%] top-0 h-9 w-px bg-champagne/35" />
                <span className="absolute left-[68%] top-9 h-2.5 w-2.5 -translate-x-1/2 border border-bronze" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
