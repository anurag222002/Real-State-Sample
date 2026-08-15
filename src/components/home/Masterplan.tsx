"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { RevealText } from "@/components/motion/RevealText";

const PLATE_W = 420;
const PLATE_D = 330;
const TILT = 58;
const SPIN = -42;

type Block = {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  label?: string;
  tone?: "primary" | "podium" | "deck";
};

const blocks: Block[] = [
  { id: "tower-a", x: 24, y: 40, w: 88, d: 88, h: 168, label: "Tower A · 41 floors", tone: "primary" },
  { id: "tower-b", x: 132, y: 22, w: 74, d: 74, h: 124, label: "Tower B · 33 floors", tone: "primary" },
  { id: "podium", x: 24, y: 146, w: 182, d: 58, h: 32, label: "Podium & parking", tone: "podium" },
  { id: "club", x: 244, y: 34, w: 124, d: 84, h: 52, label: "Clubhouse", tone: "podium" },
  { id: "retail", x: 244, y: 140, w: 124, d: 64, h: 26, tone: "podium" },
  { id: "deck", x: 24, y: 232, w: 344, d: 76, h: 8, label: "Landscape deck", tone: "deck" },
];

const legend = [
  { value: "11", unit: "acres", note: "Site area" },
  { value: "62", unit: "%", note: "Open ground" },
  { value: "3", unit: "blocks", note: "Phase one" },
];

const toneFace: Record<NonNullable<Block["tone"]>, string> = {
  primary: "rgba(64,59,53,0.96)",
  podium: "rgba(52,48,44,0.96)",
  deck: "rgba(40,52,44,0.9)",
};

const toneTop: Record<NonNullable<Block["tone"]>, string> = {
  primary: "rgba(120,111,99,0.95)",
  podium: "rgba(96,89,80,0.95)",
  deck: "rgba(74,92,78,0.9)",
};

/**
 * Masterplan build-out. The site plan draws itself, then every block extrudes
 * out of the ground in phase order until the whole precinct stands up in
 * isometric — the same drawing our planners work from.
 */
export function Masterplan() {
  const wrapRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const plate = plateRef.current;
    if (!wrap || !plate) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap.set(plate, {
        rotationX: TILT,
        rotationZ: SPIN,
        transformPerspective: 1600,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
        },
      });

      tl.fromTo(
        ".plan-ground",
        { autoAlpha: 0, scale: 0.86 },
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0,
      )
        .fromTo(
          ".plan-road",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          0.3,
        )
        .fromTo(
          ".plan-block",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, stagger: 0.18 },
          0.6,
        );

      blocks.forEach((block, index) => {
        const el = plate.querySelector<HTMLElement>(`[data-block="${block.id}"]`);
        if (!el) return;
        const at = 0.6 + index * 0.18;

        tl.fromTo(
          el,
          { "--h": "0px" },
          { "--h": `${block.h}px`, duration: 0.7, ease: "power2.out" },
          at,
        ).fromTo(
          el.querySelector(".plan-label"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          at + 0.5,
        );
      });

      // A slow orbit at the end so the massing reads in three dimensions.
      tl.to(plate, { rotationZ: SPIN + 16, duration: 1.4, ease: "none" }, 0.6);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="masterplan"
      ref={wrapRef}
      className="relative h-[300vh] bg-graphite"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="blueprint-grid-fine pointer-events-none absolute inset-0 opacity-50" />

        <div className="site-offset relative grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
              Masterplan
            </p>
            <RevealText
              as="h2"
              className="mt-5 max-w-md font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
            >
              The precinct, block by block
            </RevealText>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/60">
              Towers are set to the north edge so the podium and landscape hold
              the sun. Nothing is added to the plan that takes light away from
              what is already there.
            </p>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-champagne/12 pt-8">
              {legend.map((item) => (
                <div key={item.note}>
                  <dt className="font-display text-4xl text-ivory">
                    {item.value}
                    <span className="ml-1 text-base text-bronze">
                      {item.unit}
                    </span>
                  </dt>
                  <dd className="mt-2 text-[10px] uppercase tracking-[0.24em] text-cream/45">
                    {item.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex h-[52vh] items-center justify-center lg:h-[68vh]">
            <div
              className="origin-center scale-[0.62] sm:scale-75 lg:scale-90 xl:scale-100"
              style={{ perspective: 1600 }}
            >
              <div
                ref={plateRef}
                className="relative [transform-style:preserve-3d]"
                style={{ width: PLATE_W, height: PLATE_D }}
              >
                <div className="plan-ground absolute inset-[-28px] border border-champagne/20 bg-[rgba(18,18,18,0.75)]">
                  <div className="blueprint-grid-fine absolute inset-0 opacity-90" />
                  <span className="plan-road absolute left-0 top-1/2 h-px w-full origin-left bg-bronze/40" />
                  <span className="plan-road absolute left-[52%] top-0 h-full w-px origin-top bg-bronze/25" />
                  <span className="absolute -left-3 -top-3 h-4 w-4 border-l border-t border-champagne/50" />
                  <span className="absolute -bottom-3 -right-3 h-4 w-4 border-b border-r border-champagne/50" />
                </div>

                {blocks.map((block) => {
                  const tone = block.tone ?? "podium";
                  return (
                    <div
                      key={block.id}
                      data-block={block.id}
                      className="plan-block absolute [transform-style:preserve-3d]"
                      style={
                        {
                          left: block.x,
                          top: block.y,
                          width: block.w,
                          height: block.d,
                          "--h": "0px",
                        } as React.CSSProperties
                      }
                    >
                      {/* Roof */}
                      <span
                        className="absolute inset-0 border border-champagne/25"
                        style={{
                          background: toneTop[tone],
                          transform: "translateZ(var(--h))",
                        }}
                      />
                      {/* South elevation */}
                      <span
                        className="absolute left-0 top-0 border-x border-t border-champagne/15"
                        style={{
                          width: block.w,
                          height: "var(--h)",
                          background: toneFace[tone],
                          transformOrigin: "0 0",
                          transform: `translateY(${block.d}px) rotateX(90deg)`,
                        }}
                      />
                      {/* East elevation */}
                      <span
                        className="absolute left-0 top-0 border-y border-r border-champagne/15"
                        style={{
                          width: "var(--h)",
                          height: block.d,
                          background: toneFace[tone],
                          transformOrigin: "0 0",
                          transform: `translateX(${block.w}px) rotateY(-90deg)`,
                          filter: "brightness(0.82)",
                        }}
                      />

                      {block.label ? (
                        <span
                          className="plan-label absolute left-0 top-0 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-cream/70"
                          style={{
                            transform: `translateZ(calc(var(--h) + 26px)) rotateZ(${-SPIN}deg) rotateX(${-TILT}deg)`,
                          }}
                        >
                          <span className="mr-2 inline-block h-1.5 w-1.5 rotate-45 bg-bronze align-middle" />
                          {block.label}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
