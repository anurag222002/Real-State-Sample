"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, registerMotion, SplitText, ScrollTrigger } from "@/lib/motion";
import { tunnelState } from "@/components/webgl/tunnelState";
import { site } from "@/lib/data";
import { Hoverable } from "@/components/ui/Hoverable";

const Tunnel = dynamic(
  () => import("@/components/webgl/Tunnel").then((m) => m.Tunnel),
  { ssr: false },
);

const categories = ["Flavours", "Bar", "Snacks"];

export function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const title = titleRef.current;
    if (!wrap || !stage || !title) return;

    registerMotion();

    const ctx = gsap.context(() => {
      const split = SplitText.create(title, { type: "chars", mask: "chars" });
      gsap.set(title, { autoAlpha: 1 });

      // Entrance: letters drop in behind the tunnel once the curtain lifts.
      const intro = gsap
        .timeline({ paused: true })
        .from(split.chars, {
          yPercent: 120,
          duration: 1.5,
          stagger: 0.055,
          ease: "drape",
        })
        .from(
          ".hero-kicker",
          { autoAlpha: 0, y: 18, duration: 1 },
          0.25,
        )
        .from(
          [".hero-heading", ".hero-copy"],
          { autoAlpha: 0, y: 26, duration: 1.2, stagger: 0.12 },
          0.45,
        )
        .from(
          [".hero-foot-left", ".hero-foot-right", ".hero-cue"],
          { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.08 },
          0.7,
        );

      if (document.body.classList.contains("is-ready")) {
        intro.play();
      } else {
        window.addEventListener("timeless:preloader-done", () => intro.play(), {
          once: true,
        });
      }

      // The dive: scrolling pushes the camera through the portal while the
      // headline recedes, so the page feels like one continuous descent.
      const dive = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            tunnelState.dive = self.progress;
            tunnelState.velocity = self.getVelocity() / 400;
          },
        },
      });

      dive
        .to(
          ".hero-copy-block",
          { yPercent: -28, scale: 0.88, autoAlpha: 0, ease: "none" },
          0,
        )
        .to(".hero-plate", { scale: 1.35, autoAlpha: 0, ease: "none" }, 0)
        .to(
          [".hero-foot-left", ".hero-foot-right", ".hero-cue"],
          { autoAlpha: 0, y: 20, ease: "none", duration: 0.3 },
          0,
        )
        .to(".hero-flare", { autoAlpha: 1, ease: "none" }, 0);

      // Rotating intro words, swapped through a mask like the reference.
      const introEl = introRef.current;
      if (introEl) {
        let index = 0;
        const swap = () => {
          index = (index + 1) % site.introTexts.length;
          gsap
            .timeline()
            .to(introEl, { yPercent: -110, autoAlpha: 0, duration: 0.5, ease: "luxe" })
            .add(() => {
              introEl.textContent = site.introTexts[index];
            })
            .fromTo(
              introEl,
              { yPercent: 110, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "drape" },
            );
        };
        const timer = window.setInterval(swap, 3200);
        return () => {
          window.clearInterval(timer);
          split.revert();
        };
      }

      return () => split.revert();
    }, wrap);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="top" ref={wrapRef} className="relative h-[240vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden"
      >
        <Tunnel className="opacity-95" />

        <div className="hero-plate absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2400&q=80"
            alt="TIMELESS lounge interior"
            fill
            priority
            sizes="100vw"
            className="ken-burns object-cover opacity-25 mix-blend-soft-light"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_28%,rgba(19,18,18,0.82)_78%)]" />
        <div className="hero-flare pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(253,247,236,0.22),transparent_58%)] opacity-0" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-[var(--offset-x)] text-center">
          <div className="hero-copy-block">
            <p className="hero-kicker mb-6 text-[11px] uppercase tracking-[0.42em] text-champagne">
              {site.tagline}
            </p>
            <h1
              ref={titleRef}
              className="invisible font-display text-[19vw] font-light leading-[0.82] tracking-[-0.03em] text-ivory sm:text-[13vw] lg:text-[10.5vw]"
            >
              {site.heroTitle}
            </h1>
            <h2 className="hero-heading mt-4 font-display text-3xl font-light italic text-ivory sm:text-5xl">
              {site.heroHeading}
            </h2>
            <p className="hero-copy mx-auto mt-5 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              {site.heroText}
            </p>
          </div>
        </div>

        <div className="hero-foot-left absolute bottom-[var(--offset-bottom)] left-[var(--offset-x)] z-10 h-5 overflow-hidden">
          <span
            ref={introRef}
            className="block text-[11px] uppercase tracking-[0.32em] text-champagne/90"
          >
            {site.introTexts[0]}
          </span>
        </div>

        <div className="hero-cue absolute bottom-[var(--offset-bottom)] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="text-[9px] uppercase tracking-[0.38em] text-cream/45">
            Scroll
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-champagne/20">
            <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-champagne" />
          </span>
        </div>

        <div className="hero-foot-right absolute bottom-[var(--offset-bottom)] right-[var(--offset-x)] z-10 hidden gap-8 sm:flex">
          {categories.map((item) => (
            <Hoverable key={item}>
              <a
                href="#menu"
                className="link-underline text-[11px] uppercase tracking-[0.28em] text-cream/80"
              >
                {item}
              </a>
            </Hoverable>
          ))}
        </div>
      </div>
    </section>
  );
}
