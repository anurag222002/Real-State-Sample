"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { overlayExtras, overlayMenu, socials } from "@/lib/data";
import { useUI } from "@/components/providers/AppProviders";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function NavOverlay() {
  const { navOpen, setNavOpen, setReserveOpen } = useUI();
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ paused: true })
        .set(root, { pointerEvents: "auto" })
        .fromTo(
          root,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "luxe" },
        )
        .fromTo(
          ".nav-group",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "drape" },
          0.25,
        )
        .fromTo(
          ".nav-item",
          { autoAlpha: 0, y: 34, rotate: 1.5 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.75,
            stagger: 0.035,
            ease: "drape",
          },
          0.3,
        )
        .fromTo(
          ".nav-aside",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "drape" },
          0.45,
        );

      timelineRef.current = tl;
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const tl = timelineRef.current;
    const root = rootRef.current;
    document.body.classList.toggle("nav-open", navOpen);
    window.dispatchEvent(
      new Event(navOpen ? "timeless:scroll-lock" : "timeless:scroll-unlock"),
    );

    if (!tl) return;
    if (navOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
      if (root) {
        gsap.delayedCall(0.55, () => gsap.set(root, { pointerEvents: "none" }));
      }
    }
  }, [navOpen]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-40 bg-void/95 backdrop-blur-xl"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
    >
      <div className="site-offset grid h-full grid-cols-1 gap-10 overflow-y-auto pb-10 pt-[calc(var(--header-height)+12px)] no-scrollbar lg:grid-cols-[1.2fr_0.8fr] lg:overflow-hidden">
        <div className="lg:overflow-y-auto lg:no-scrollbar">
          {overlayMenu.map((group) => (
            <div key={group.name} className="nav-group mb-10">
              <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-champagne">
                {group.name}
              </p>
              <ul className="flex flex-col gap-1.5">
                {group.children.map((item) => (
                  <li key={item.name} className="nav-item overflow-hidden">
                    <Hoverable>
                      <TransitionLink
                        href={item.href}
                        onClick={() => setNavOpen(false)}
                        className="inline-block font-display text-3xl font-light italic text-ivory transition-colors duration-500 hover:text-champagne sm:text-4xl"
                      >
                        {item.name}
                      </TransitionLink>
                    </Hoverable>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-10">
          <ul className="nav-aside flex flex-col gap-3">
            {overlayExtras.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <Hoverable>
                  <TransitionLink
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className="link-underline text-[13px] uppercase tracking-[0.22em] text-cream/80"
                  >
                    {item.name}
                  </TransitionLink>
                </Hoverable>
                {"soon" in item && item.soon ? (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-bronze">
                    Soon
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="nav-aside flex flex-col gap-6">
            <Hoverable>
              <TransitionLink
                href="/locations"
                onClick={() => setNavOpen(false)}
                className="font-display text-2xl italic text-ivory"
              >
                Club Card
              </TransitionLink>
            </Hoverable>
            <ChampagneButton
              magnetic
              onClick={() => {
                setNavOpen(false);
                setReserveOpen(true);
              }}
            >
              Reserve
            </ChampagneButton>
            <div className="flex flex-wrap gap-5">
              {socials.map((s) => (
                <Hoverable key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-[11px] uppercase tracking-[0.24em] text-champagne"
                  >
                    {s.name}
                  </a>
                </Hoverable>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
