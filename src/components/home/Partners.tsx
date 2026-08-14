"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import { partners } from "@/lib/data";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";

/** Consultant quotes, cross-faded with a masked type swap. */
export function Partners() {
  const [active, setActive] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        quote.querySelectorAll(".quote-part"),
        { yPercent: 40, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "drape",
        },
      );
    }, quote);

    return () => ctx.revert();
  }, [active]);

  const partner = partners[active];

  return (
    <section id="philosophy" className="relative bg-graphite py-28 lg:py-36">
      <div className="site-offset">
        <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">
          From our partners
        </p>
        <RevealText
          as="h2"
          className="mt-4 max-w-2xl font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
        >
          Designed with people who sign their work
        </RevealText>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.42fr_1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden">
            {partners.map((item, index) => (
              <Image
                key={item.name}
                src={item.image}
                alt={item.name}
                fill
                sizes="320px"
                className="object-cover transition-[opacity,transform] duration-[1.1s] ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  opacity: index === active ? 1 : 0,
                  transform: index === active ? "scale(1)" : "scale(1.08)",
                }}
              />
            ))}
            <span className="pointer-events-none absolute inset-0 border border-champagne/15" />
          </div>

          <div ref={quoteRef}>
            <blockquote className="quote-part max-w-3xl font-accent text-2xl font-light italic leading-snug text-ivory sm:text-4xl">
              “{partner.quote}”
            </blockquote>
            <div className="quote-part mt-8 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <p className="text-[12px] uppercase tracking-[0.24em] text-ivory">
                {partner.name}
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">
                {partner.role}
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              {partners.map((item, index) => (
                <Hoverable key={item.name}>
                  <button
                    onClick={() => setActive(index)}
                    className="group text-left"
                  >
                    <span
                      className="block text-[11px] uppercase tracking-[0.24em] transition-colors duration-500"
                      style={{
                        color:
                          index === active
                            ? "#fbf7f0"
                            : "rgba(236,231,222,0.38)",
                      }}
                    >
                      {item.role}
                    </span>
                    <span
                      className="mt-2 block h-px origin-left bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                      style={{
                        transform: `scaleX(${index === active ? 1 : 0})`,
                      }}
                    />
                  </button>
                </Hoverable>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
