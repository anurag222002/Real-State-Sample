"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, scrollState } from "@/lib/motion";

const words = [
  "Art of taste",
  "Beautiful people",
  "Signature cocktails",
  "Beyond time",
];

/**
 * Endless champagne ticker. Scroll velocity bends the speed, which is the
 * detail that makes a marquee feel alive rather than looped.
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      const ticker = () => {
        const boost = 1 + Math.min(Math.abs(scrollState.velocity) * 0.12, 5);
        tween.timeScale(boost);
      };
      gsap.ticker.add(ticker);

      return () => gsap.ticker.remove(ticker);
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-champagne/12 bg-void py-8">
      <div ref={trackRef} className="flex w-max items-center gap-14 will-change-transform">
        {Array.from({ length: 2 }).flatMap((_, copy) =>
          words.map((word) => (
            <span
              key={`${copy}-${word}`}
              className="flex items-center gap-14 whitespace-nowrap font-display text-3xl font-light italic text-cream/60 sm:text-5xl"
            >
              {word}
              <span className="h-1.5 w-1.5 rotate-45 bg-champagne/70" />
            </span>
          )),
        )}
      </div>
    </section>
  );
}
