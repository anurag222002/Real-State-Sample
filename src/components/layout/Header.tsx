"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";
import { navLinks, site } from "@/lib/data";
import { useUI } from "@/components/providers/AppProviders";
import { BronzeButton } from "@/components/ui/BronzeButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function Header() {
  const { navOpen, setNavOpen, setEnquiryOpen } = useUI();
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

      // Chrome retreats while descending the page and returns on the way up.
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
              ? "rgba(18,18,18,0.74)"
              : "rgba(18,18,18,0)",
            backdropFilter: self.isActive ? "blur(14px)" : "blur(0px)",
            borderBottomColor: self.isActive
              ? "rgba(216,208,194,0.12)"
              : "rgba(216,208,194,0)",
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
    const play = () =>
      gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "luxe" });

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
            aria-label={`${site.name} home`}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span className="block font-display text-[15px] tracking-[0.46em] text-ivory transition-colors duration-500 hover:text-bronze sm:text-[17px]">
              {site.name}
            </span>
            <span className="mt-1 hidden text-[8px] uppercase tracking-[0.3em] text-cream/40 sm:block">
              {site.established}
            </span>
          </TransitionLink>
        </Hoverable>

        <div className="pointer-events-auto ml-auto flex items-center gap-3 sm:gap-5">
          <Hoverable>
            <a
              href="tel:+912200000000"
              className="hidden text-[12px] uppercase tracking-[0.22em] text-cream/90 md:inline"
            >
              +91 22 0000 0000
            </a>
          </Hoverable>
          <BronzeButton onClick={() => setEnquiryOpen(true)}>
            Enquire
          </BronzeButton>
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
