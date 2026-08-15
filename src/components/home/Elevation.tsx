"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { RevealText } from "@/components/motion/RevealText";

const COLS = 8;
const ROWS = 10;
const PANELS = COLS * ROWS;
const FACADE =
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80";

const specs = [
  { label: "Panels", value: "1,240 units" },
  { label: "Glazing", value: "Low-E double" },
  { label: "Testing", value: "Mock-up water rig" },
];

/**
 * Facade installation. Scrolling hoists curtain-wall panels onto a dashed
 * survey frame, bottom row first, until the elevation is closed and the glass
 * catches its first light.
 */
export function Elevation() {
  const wrapRef = useRef<HTMLElement>(null);
  const hoistRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".facade-panel");

      gsap.set(panels, { transformOrigin: "center bottom" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            const installed = Math.round(
              gsap.utils.clamp(0, 1, self.progress / 0.86) * PANELS,
            );
            if (countRef.current) {
              countRef.current.textContent = String(installed).padStart(2, "0");
            }
            if (hoistRef.current) {
              hoistRef.current.style.height = `${gsap.utils.clamp(
                4,
                100,
                (installed / PANELS) * 100,
              )}%`;
            }
          },
        },
      });

      tl.fromTo(
        ".facade-guide-v",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.5, stagger: 0.02, ease: "power2.out" },
        0,
      )
        .fromTo(
          ".facade-guide-h",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, stagger: 0.015, ease: "power2.out" },
          0.1,
        )
        .fromTo(
          panels,
          { autoAlpha: 0, yPercent: 130, rotateX: -55, scale: 0.9 },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger: {
              each: 0.035,
              grid: [ROWS, COLS],
              axis: "y",
              from: "end",
            },
          },
          0.4,
        )
        .fromTo(
          ".facade-sheen",
          { xPercent: -140, autoAlpha: 0 },
          { xPercent: 260, autoAlpha: 1, duration: 1.2, ease: "power2.inOut" },
          "-=0.6",
        )
        .fromTo(
          ".facade-crown",
          { autoAlpha: 0, yPercent: 60 },
          { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "power3.out" },
          "-=0.9",
        );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="facade" ref={wrapRef} className="relative h-[300vh] bg-void">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />

        <div className="site-offset relative grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
              Facade & envelope
            </p>
            <RevealText
              as="h2"
              className="mt-5 max-w-md font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
            >
              The skin goes on panel by panel
            </RevealText>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/60">
              Unitised curtain wall is hoisted from the lowest floor upward, each
              panel set against a surveyed frame and sealed before the next
              course begins.
            </p>

            <div className="mt-10 flex items-baseline gap-4">
              <span className="font-display text-5xl text-ivory sm:text-6xl">
                <span ref={countRef}>00</span>
                <span className="text-cream/35"> / {PANELS}</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/45">
                Bays installed
              </span>
            </div>

            <dl className="mt-10 grid gap-5 border-t border-champagne/12 pt-8 sm:grid-cols-3">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-bronze">
                    {spec.label}
                  </dt>
                  <dd className="mt-2 text-sm text-cream/60">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] [perspective:1400px] lg:max-w-[460px]">
            {/* Surveyed frame the panels are set against. */}
            <div className="absolute inset-0 border border-champagne/20">
              {Array.from({ length: COLS - 1 }).map((_, i) => (
                <span
                  key={`v${i}`}
                  className="facade-guide-v absolute inset-y-0 w-px origin-top bg-champagne/12"
                  style={{ left: `${((i + 1) / COLS) * 100}%` }}
                />
              ))}
              {Array.from({ length: ROWS - 1 }).map((_, i) => (
                <span
                  key={`h${i}`}
                  className="facade-guide-h absolute inset-x-0 h-px origin-left bg-champagne/12"
                  style={{ top: `${((i + 1) / ROWS) * 100}%` }}
                />
              ))}
            </div>

            {/* Hoist rail tracking the installed height. */}
            <div className="absolute -left-8 bottom-0 top-0 w-6">
              <span className="absolute inset-y-0 left-3 w-px bg-champagne/15" />
              <div
                ref={hoistRef}
                className="absolute bottom-0 left-3 w-px bg-bronze"
                style={{ height: "4%" }}
              >
                <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rotate-45 border border-bronze bg-void" />
              </div>
            </div>

            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {Array.from({ length: PANELS }).map((_, index) => {
                const col = index % COLS;
                const row = Math.floor(index / COLS);
                return (
                  <span
                    key={index}
                    className="facade-panel absolute block"
                    style={{
                      left: `${(col / COLS) * 100}%`,
                      top: `${(row / ROWS) * 100}%`,
                      width: `${100 / COLS}%`,
                      height: `${100 / ROWS}%`,
                      backgroundImage: `url(${FACADE})`,
                      backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                      backgroundPosition: `${(col * 100) / (COLS - 1)}% ${
                        (row * 100) / (ROWS - 1)
                      }%`,
                      boxShadow: "inset 0 0 0 1px rgba(18,18,18,0.55)",
                    }}
                  />
                );
              })}
            </div>

            {/* Parapet and the first light across finished glass. */}
            <span className="facade-crown absolute inset-x-[-4%] -top-3 h-3 border-x border-t border-champagne/30" />
            <span className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="facade-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ivory/25 to-transparent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
