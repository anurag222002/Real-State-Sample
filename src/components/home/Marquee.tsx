"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, scrollState } from "@/lib/motion";

const words = [
  "Seven decades of building",
  "IGBC aligned design",
  "RERA registered",
  "Quality before profit",
];

/** Endless ticker whose speed bends with scroll velocity. */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      const ticker = () => {
        tween.timeScale(1 + Math.min(Math.abs(scrollState.velocity) * 0.12, 5));
      };
      gsap.ticker.add(ticker);

      return () => gsap.ticker.remove(ticker);
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-champagne/12 bg-graphite py-7">
      <div
        ref={trackRef}
        className="flex w-max items-center gap-14 will-change-transform"
      >
        {Array.from({ length: 2 }).flatMap((_, copy) =>
          words.map((word) => (
            <span
              key={`${copy}-${word}`}
              className="flex items-center gap-14 whitespace-nowrap font-display text-xl uppercase tracking-[0.2em] text-cream/55 sm:text-3xl"
            >
              {word}
              <span className="h-1.5 w-1.5 rotate-45 bg-bronze" />
            </span>
          )),
        )}
      </div>
    </section>
  );
}
