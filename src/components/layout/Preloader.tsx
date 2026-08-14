"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, SplitText, ScrollTrigger } from "@/lib/motion";
import { site } from "@/lib/data";

/**
 * Opening sequence: a champagne progress rule fills while the wordmark letters
 * rise, then the curtain splits away and hands control to the page.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    registerMotion();
    document.documentElement.classList.add("is-loading");

    const ctx = gsap.context(() => {
      const title = root.querySelector<HTMLElement>(".preloader-title");
      const split = title
        ? SplitText.create(title, { type: "chars", mask: "chars" })
        : null;

      const progress = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("is-loading");
          document.body.classList.add("is-ready");
          window.dispatchEvent(new Event("timeless:preloader-done"));
          ScrollTrigger.refresh();
          root.remove();
        },
      });

      tl.to(".preloader-kicker", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "silk",
      })
        .to(
          split?.chars ?? [],
          {
            yPercent: 0,
            duration: 1.3,
            stagger: 0.045,
            ease: "drape",
          },
          0.15,
        )
        .to(
          progress,
          {
            value: 100,
            duration: 2.1,
            ease: "power2.inOut",
            onUpdate: () => {
              counter.textContent = String(Math.round(progress.value)).padStart(
                2,
                "0",
              );
            },
          },
          0.1,
        )
        .to(
          ".preloader-rule-fill",
          { scaleX: 1, duration: 2.1, ease: "power2.inOut" },
          0.1,
        )
        .to(
          [".preloader-kicker", ".preloader-meta"],
          { autoAlpha: 0, y: -14, duration: 0.6, ease: "luxe" },
          "+=0.15",
        )
        .to(
          split?.chars ?? [],
          {
            yPercent: -118,
            duration: 0.9,
            stagger: 0.02,
            ease: "luxe",
          },
          "-=0.5",
        )
        .to(
          ".preloader-panel",
          {
            scaleY: 0,
            duration: 1.25,
            stagger: 0.075,
            ease: "luxe",
            transformOrigin: "top center",
          },
          "-=0.45",
        );

      return () => split?.revert();
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="preloader-panel h-full flex-1 bg-void"
            style={{ transformOrigin: "top center" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="preloader-kicker invisible translate-y-4 text-[10px] uppercase tracking-[0.48em] text-champagne/80">
          {site.preloaderSubtitle}
        </p>
        <h1 className="preloader-title mt-6 font-display text-5xl font-light italic text-ivory sm:text-7xl">
          {site.preloaderText}
        </h1>
        <div className="preloader-meta mt-12 flex w-[min(320px,72vw)] items-center gap-4">
          <span className="preloader-rule relative h-px flex-1 bg-champagne/20">
            <span className="preloader-rule-fill absolute inset-0 origin-left scale-x-0 bg-champagne" />
          </span>
          <span
            ref={counterRef}
            className="w-8 text-right text-[11px] tracking-[0.2em] text-champagne"
          >
            00
          </span>
        </div>
      </div>
    </div>
  );
}
