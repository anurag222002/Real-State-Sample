"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, registerMotion, SplitText, ScrollTrigger } from "@/lib/motion";
import { sceneState } from "@/components/webgl/sceneState";
import { site } from "@/lib/data";
import { Hoverable } from "@/components/ui/Hoverable";

const CityCorridor = dynamic(
  () => import("@/components/webgl/CityCorridor").then((m) => m.CityCorridor),
  { ssr: false },
);

const markers = ["Mumbai", "Pune", "Alibaug", "Nashik"];

export function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const title = titleRef.current;
    if (!wrap || !title) return;

    registerMotion();

    const ctx = gsap.context(() => {
      const split = SplitText.create(title, { type: "chars", mask: "chars" });
      gsap.set(title, { autoAlpha: 1 });

      const intro = gsap
        .timeline({ paused: true })
        .from(split.chars, {
          yPercent: 120,
          duration: 1.5,
          stagger: 0.05,
          ease: "drape",
        })
        .from(".hero-kicker", { autoAlpha: 0, y: 18, duration: 1 }, 0.25)
        .from(
          [".hero-heading", ".hero-copy"],
          { autoAlpha: 0, y: 26, duration: 1.2, stagger: 0.12 },
          0.45,
        )
        .from(
          ".hero-rule",
          { scaleX: 0, duration: 1.4, ease: "luxe", transformOrigin: "left center" },
          0.5,
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

      // Scrolling flies the camera down the street canyon while the titling
      // recedes, so the hero hands over to the page without a cut.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => {
              sceneState.dive = self.progress;
              sceneState.velocity = self.getVelocity() / 400;
            },
          },
        })
        .to(
          ".hero-copy-block",
          { yPercent: -26, scale: 0.9, autoAlpha: 0, ease: "none" },
          0,
        )
        .to(".hero-plate", { scale: 1.3, autoAlpha: 0, ease: "none" }, 0)
        .to(
          [".hero-foot-left", ".hero-foot-right", ".hero-cue"],
          { autoAlpha: 0, y: 18, ease: "none", duration: 0.3 },
          0,
        );

      const introEl = introRef.current;
      if (introEl) {
        let index = 0;
        const timer = window.setInterval(() => {
          index = (index + 1) % site.introTexts.length;
          gsap
            .timeline()
            .to(introEl, {
              yPercent: -110,
              autoAlpha: 0,
              duration: 0.5,
              ease: "luxe",
            })
            .add(() => {
              introEl.textContent = site.introTexts[index];
            })
            .fromTo(
              introEl,
              { yPercent: 110, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "drape" },
            );
        }, 3200);

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
    <section id="top" ref={wrapRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
        <CityCorridor />

        <div className="hero-plate absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
            alt="Meridian tower elevation at dusk"
            fill
            priority
            sizes="100vw"
            className="ken-burns object-cover opacity-20 mix-blend-soft-light"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,18,18,0.72),rgba(18,18,18,0.28)_38%,rgba(18,18,18,0.92))]" />

        <div className="relative z-10 flex h-full flex-col justify-center px-[var(--offset-x)]">
          <div className="hero-copy-block max-w-5xl">
            <p className="hero-kicker mb-7 text-[11px] uppercase tracking-[0.42em] text-bronze">
              {site.established} — {site.tagline}
            </p>
            <h1
              ref={titleRef}
              className="invisible font-display text-[15vw] leading-[0.9] tracking-[0.01em] text-ivory sm:text-[12vw] lg:text-[9vw]"
            >
              {site.heroTitle}
            </h1>
            <span className="hero-rule mt-8 block h-px w-full max-w-xl bg-gradient-to-r from-bronze via-champagne/40 to-transparent" />
            <h2 className="hero-heading mt-8 max-w-xl font-accent text-2xl font-light italic leading-snug text-ivory sm:text-4xl">
              {site.heroHeading}
            </h2>
            <p className="hero-copy mt-5 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
              {site.heroText}
            </p>
          </div>
        </div>

        <div className="hero-foot-left absolute bottom-[var(--offset-bottom)] left-[var(--offset-x)] z-10 h-5 overflow-hidden">
          <span
            ref={introRef}
            className="block text-[11px] uppercase tracking-[0.32em] text-champagne/85"
          >
            {site.introTexts[0]}
          </span>
        </div>

        <div className="hero-cue absolute bottom-[var(--offset-bottom)] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="text-[9px] uppercase tracking-[0.38em] text-cream/45">
            Explore
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-champagne/20">
            <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-bronze" />
          </span>
        </div>

        <div className="hero-foot-right absolute bottom-[var(--offset-bottom)] right-[var(--offset-x)] z-10 hidden items-center gap-7 sm:flex">
          {markers.map((city) => (
            <Hoverable key={city}>
              <a
                href="#collection"
                className="link-underline text-[11px] uppercase tracking-[0.28em] text-cream/70"
              >
                {city}
              </a>
            </Hoverable>
          ))}
        </div>
      </div>
    </section>
  );
}
