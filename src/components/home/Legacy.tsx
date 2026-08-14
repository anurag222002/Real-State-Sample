"use client";

import { site, stats } from "@/lib/data";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Parallax } from "@/components/motion/Parallax";
import { Counter } from "@/components/motion/Counter";
import { BronzeButton } from "@/components/ui/BronzeButton";

const frames = [
  {
    src: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1400&q=80",
    caption: "Site works, Andheri West — 2026",
    className: "aspect-[4/5]",
    parallax: 70,
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    caption: "Tower lobby, material study",
    className: "aspect-[3/4]",
    parallax: 120,
  },
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80",
    caption: "Meridian One, delivered elevation",
    className: "aspect-square",
    parallax: 90,
  },
];

/** Editorial about-strip: statement stays pinned, site imagery drifts past. */
export function Legacy() {
  return (
    <section id="legacy" className="relative bg-void py-28 lg:py-40">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="site-offset relative grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+64px)] lg:h-fit">
          <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
            Our legacy
          </p>
          <RevealText
            as="h2"
            className="mt-6 font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
          >
            Seventy years of building on one oath
          </RevealText>
          <RevealText className="mt-8 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
            {site.legalName} began as a construction house and grew into a
            developer of city-shaping addresses. Through every cycle the order
            of priorities has not moved: quality before profit, trust before
            everything.
          </RevealText>
          <div className="mt-10">
            <BronzeButton magnetic>Read our history</BronzeButton>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-champagne/12 pt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl text-ivory sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-2 text-[10px] uppercase tracking-[0.24em] text-cream/45">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {frames.map((frame, i) => (
            <figure
              key={frame.src}
              className={i % 2 === 1 ? "sm:ml-auto sm:w-[78%]" : "sm:w-[88%]"}
            >
              <RevealImage
                src={frame.src}
                alt={frame.caption}
                sizes="55vw"
                parallax={frame.parallax}
                direction={i % 2 === 1 ? "right" : "up"}
                className={`w-full ${frame.className}`}
              />
              <Parallax distance={40}>
                <figcaption className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-cream/45">
                  <span className="h-px w-8 bg-bronze" />
                  {frame.caption}
                </figcaption>
              </Parallax>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
