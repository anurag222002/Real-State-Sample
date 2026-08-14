"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerMotion, SplitText } from "@/lib/motion";
import { ladderSlides } from "@/lib/data";
import { PlusIcon } from "@/components/ui/PlusIcon";
import { Hoverable } from "@/components/ui/Hoverable";

const floaters = [
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80",
    className: "left-[6%] top-[62%] h-40 w-28 portal-ovals sm:h-52 sm:w-36",
    depth: 1.35,
    spin: -14,
  },
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
    className: "right-[8%] top-[70%] h-36 w-28 portal-trapezoid sm:h-48 sm:w-36",
    depth: 1.75,
    spin: 12,
  },
  {
    kind: "image" as const,
    src: "https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=600&q=80",
    className: "left-[18%] top-[86%] h-28 w-24 portal-eight sm:h-36 sm:w-28",
    depth: 2.15,
    spin: -20,
  },
  { kind: "plus" as const, className: "left-[12%] top-[40%]", depth: 0.9, spin: 90 },
  { kind: "plus" as const, className: "right-[16%] top-[30%]", depth: 1.5, spin: -120 },
  {
    kind: "ring" as const,
    className: "right-[24%] top-[54%] h-28 w-28",
    depth: 1.15,
    spin: 40,
  },
  {
    kind: "ring" as const,
    className: "left-[26%] top-[22%] h-44 w-44",
    depth: 0.75,
    spin: -30,
  },
  {
    kind: "rule" as const,
    className: "left-[44%] top-[16%] w-40",
    depth: 1.9,
    spin: 8,
  },
];

/**
 * The descent. Objects stream upward past a fixed viewport while the copy
 * changes stage by stage — the reference's "falling through the portal" beat.
 */
export function Ladder() {
  const wrapRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      gsap.utils.toArray<HTMLElement>(".fall-object").forEach((el) => {
        const depth = Number(el.dataset.depth ?? 1);
        const spin = Number(el.dataset.spin ?? 0);
        gsap.fromTo(
          el,
          { yPercent: 40 * depth, rotate: -spin / 2, scale: 0.9 },
          {
            yPercent: -260 * depth,
            rotate: spin / 2,
            scale: 1.05,
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

      gsap.utils.toArray<HTMLElement>(".ladder-slide").forEach((slide, index) => {
        const line = slide.querySelector<HTMLElement>(".ladder-line");
        const link = slide.querySelector<HTMLElement>(".ladder-link");
        const split = line
          ? SplitText.create(line, { type: "words", mask: "words" })
          : null;
        if (split) splits.push(split);

        const position = index * 1.1;

        if (split) {
          tl.fromTo(
            split.words,
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 0.55,
              stagger: 0.035,
              ease: "drape",
            },
            position,
          );
        }

        if (link) {
          tl.fromTo(
            link,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.3 },
            position + 0.35,
          );
        }

        // Every stage but the last clears out before the next arrives.
        if (index < ladderSlides.length - 1) {
          if (split) {
            tl.to(
              split.words,
              {
                yPercent: -115,
                duration: 0.45,
                stagger: 0.02,
                ease: "luxe",
              },
              position + 0.72,
            );
          }
          if (link) {
            tl.to(
              link,
              { autoAlpha: 0, y: -14, duration: 0.25 },
              position + 0.72,
            );
          }
        }
      });

      return () => splits.forEach((split) => split.revert());
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ladder" ref={wrapRef} className="relative h-[420vh] bg-void">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {floaters.map((floater, index) => (
            <div
              key={index}
              data-depth={floater.depth}
              data-spin={floater.spin}
              className={`fall-object absolute ${floater.className}`}
            >
              {floater.kind === "image" ? (
                <div className="relative h-full w-full overflow-hidden opacity-70">
                  <Image
                    src={floater.src}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {floater.kind === "plus" ? <PlusIcon className="opacity-45" /> : null}
              {floater.kind === "ring" ? (
                <span className="block h-full w-full rounded-full border border-champagne/20" />
              ) : null}
              {floater.kind === "rule" ? (
                <span className="block h-px w-full bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(19,18,18,0.2),rgba(19,18,18,0.9))]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-[var(--offset-x)] text-center">
          {ladderSlides.map((slide, index) => (
            <div
              key={slide.text}
              className={`ladder-slide ${index === 0 ? "" : "absolute inset-x-0 top-1/2 -translate-y-1/2"} px-[var(--offset-x)]`}
            >
              <p className="ladder-line font-display text-4xl font-light italic leading-[1.08] text-ivory sm:text-6xl lg:text-7xl">
                {slide.text}
              </p>
              {slide.link ? (
                <Hoverable>
                  <a
                    href={slide.link.href}
                    className="ladder-link link-underline mt-10 inline-block text-[12px] uppercase tracking-[0.32em] text-champagne opacity-0"
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
            className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-champagne"
          />
        </div>
      </div>
    </section>
  );
}
