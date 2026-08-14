"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerMotion, SplitText } from "@/lib/motion";
import { riseSlides } from "@/lib/data";
import { Hoverable } from "@/components/ui/Hoverable";

const floaters = [
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80",
    className: "left-[6%] top-[70%] h-44 w-28 portal-tower sm:h-56 sm:w-36",
    depth: 1.35,
    spin: -8,
  },
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80",
    className: "right-[8%] top-[78%] h-40 w-28 portal-chamfer sm:h-52 sm:w-36",
    depth: 1.8,
    spin: 7,
  },
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
    className: "left-[19%] top-[92%] h-28 w-28 portal-aperture sm:h-36 sm:w-32",
    depth: 2.2,
    spin: -12,
  },
  { kind: "tick" as const, className: "left-[13%] top-[44%]", depth: 0.9, spin: 0 },
  { kind: "tick" as const, className: "right-[17%] top-[34%]", depth: 1.5, spin: 0 },
  {
    kind: "frame" as const,
    className: "right-[25%] top-[58%] h-24 w-24",
    depth: 1.15,
    spin: 18,
  },
  {
    kind: "frame" as const,
    className: "left-[27%] top-[24%] h-40 w-40",
    depth: 0.75,
    spin: -14,
  },
  {
    kind: "rule" as const,
    className: "left-[45%] top-[18%] w-40",
    depth: 1.9,
    spin: 4,
  },
];

/**
 * The ascent: structural fragments rise past a held viewport while the
 * statement changes stage by stage.
 */
export function Rise() {
  const wrapRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      gsap.utils.toArray<HTMLElement>(".rise-object").forEach((el) => {
        const depth = Number(el.dataset.depth ?? 1);
        const spin = Number(el.dataset.spin ?? 0);
        gsap.fromTo(
          el,
          { yPercent: 60 * depth, rotate: -spin / 2, scale: 0.88 },
          {
            yPercent: -280 * depth,
            rotate: spin / 2,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
            },
          },
        );
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          onUpdate: (self) => {
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        },
      });

      gsap.utils.toArray<HTMLElement>(".rise-slide").forEach((slide, index) => {
        const line = slide.querySelector<HTMLElement>(".rise-line");
        const link = slide.querySelector<HTMLElement>(".rise-link");
        const split = line
          ? SplitText.create(line, { type: "words", mask: "words" })
          : null;
        if (split) splits.push(split);

        const at = index * 1.1;

        if (split) {
          tl.fromTo(
            split.words,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.55, stagger: 0.035, ease: "drape" },
            at,
          );
        }
        if (link) {
          tl.fromTo(
            link,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.3 },
            at + 0.35,
          );
        }

        if (index < riseSlides.length - 1) {
          if (split) {
            tl.to(
              split.words,
              { yPercent: -115, duration: 0.45, stagger: 0.02, ease: "luxe" },
              at + 0.72,
            );
          }
          if (link) {
            tl.to(link, { autoAlpha: 0, y: -14, duration: 0.25 }, at + 0.72);
          }
        }
      });

      return () => splits.forEach((split) => split.revert());
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[420vh] bg-void">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />

        <div className="pointer-events-none absolute inset-0">
          {floaters.map((floater, index) => (
            <div
              key={index}
              data-depth={floater.depth}
              data-spin={floater.spin}
              className={`rise-object absolute ${floater.className}`}
            >
              {floater.kind === "image" ? (
                <div className="relative h-full w-full overflow-hidden opacity-70">
                  <Image
                    src={floater.src}
                    alt=""
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {floater.kind === "tick" ? (
                <span className="block h-10 w-10 border-l border-t border-bronze/60" />
              ) : null}
              {floater.kind === "frame" ? (
                <span className="block h-full w-full border border-champagne/18" />
              ) : null}
              {floater.kind === "rule" ? (
                <span className="block h-px w-full bg-gradient-to-r from-transparent via-bronze/60 to-transparent" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(18,18,18,0.25),rgba(18,18,18,0.94))]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-[var(--offset-x)] text-center">
          {riseSlides.map((slide, index) => (
            <div
              key={slide.text}
              className={`rise-slide ${
                index === 0 ? "" : "absolute inset-x-0 top-1/2 -translate-y-1/2"
              } px-[var(--offset-x)]`}
            >
              <p className="rise-line font-accent text-4xl font-light italic leading-[1.1] text-ivory sm:text-6xl lg:text-7xl">
                {slide.text}
              </p>
              {slide.link ? (
                <Hoverable>
                  <a
                    href={slide.link.href}
                    className="rise-link link-underline mt-10 inline-block text-[12px] uppercase tracking-[0.32em] text-bronze opacity-0"
                  >
                    {slide.link.name}
                  </a>
                </Hoverable>
              ) : null}
            </div>
          ))}
        </div>

        <div className="absolute right-[var(--offset-x)] top-1/2 z-10 hidden h-32 w-px -translate-y-1/2 bg-champagne/15 lg:block">
          <span
            ref={fillRef}
            className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-bronze"
          />
        </div>
      </div>
    </section>
  );
}
