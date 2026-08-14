"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";
import { navLinks } from "@/lib/data";
import { useUI } from "@/components/providers/AppProviders";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function Header() {
  const { navOpen, setNavOpen, setReserveOpen } = useUI();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const show = gsap.quickTo(header, "yPercent", {
        duration: 0.5,
        ease: "power3.out",
      });

      // Chrome retreats when diving down the page and returns on the way up.
      ScrollTrigger.create({
        start: 200,
        end: "max",
        onUpdate: (self) => {
          if (navOpen) return;
          show(self.direction === 1 ? -100 : 0);
        },
        onLeaveBack: () => show(0),
      });

      ScrollTrigger.create({
        start: 80,
        end: "max",
        onToggle: (self) => {
          gsap.to(header, {
            backgroundColor: self.isActive
              ? "rgba(19,18,18,0.72)"
              : "rgba(19,18,18,0)",
            backdropFilter: self.isActive ? "blur(14px)" : "blur(0px)",
            duration: 0.6,
            ease: "luxe",
          });
        },
      });
    }, header);

    return () => ctx.revert();
  }, [navOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const play = () => gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "luxe" });
    if (document.body.classList.contains("is-ready")) {
      play();
      return;
    }
    gsap.set(header, { yPercent: -100, autoAlpha: 0 });
    window.addEventListener("timeless:preloader-done", play, { once: true });
    return () => window.removeEventListener("timeless:preloader-done", play);
  }, []);

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-transparent"
    >
      <div className="site-offset flex h-[var(--header-height)] items-center justify-between">
        <nav className="pointer-events-auto hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Hoverable key={link.href}>
              <TransitionLink
                href={link.href}
                className="link-underline text-[12px] uppercase tracking-[0.22em] text-cream/90"
              >
                {link.label}
              </TransitionLink>
            </Hoverable>
          ))}
        </nav>

        <Hoverable>
          <TransitionLink
            href="/"
            aria-label="TIMELESS home"
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="block font-display text-[15px] font-medium tracking-[0.48em] text-champagne transition-colors duration-500 hover:text-ivory sm:text-[17px]">
              TIMELESS
            </span>
          </TransitionLink>
        </Hoverable>

        <div className="pointer-events-auto ml-auto flex items-center gap-3 sm:gap-5">
          <Hoverable>
            <button className="hidden text-[12px] uppercase tracking-[0.22em] text-cream/90 md:inline">
              EN
            </button>
          </Hoverable>
          <Hoverable>
            <button className="hidden text-[12px] uppercase tracking-[0.22em] text-cream/90 md:inline">
              Moscow
            </button>
          </Hoverable>
          <ChampagneButton magnetic onClick={() => setReserveOpen(true)}>
            Reserve
          </ChampagneButton>
          <Hoverable>
            <button
              aria-label={navOpen ? "Close menu" : "Open menu"}
              onClick={() => setNavOpen(!navOpen)}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <span
                className={`absolute h-px w-5 bg-cream transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  navOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-cream transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  navOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </Hoverable>
        </div>
      </div>
    </header>
  );
}
