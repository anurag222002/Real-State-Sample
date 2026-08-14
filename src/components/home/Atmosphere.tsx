"use client";

import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Parallax } from "@/components/motion/Parallax";

const columns = [
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    caption: "Interiors composed like a stage set",
    className: "aspect-[4/5]",
    parallax: 70,
  },
  {
    src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80",
    caption: "Mixology, performed nightly",
    className: "aspect-[3/4]",
    parallax: 120,
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    caption: "Tables that keep their own time",
    className: "aspect-square",
    parallax: 90,
  },
];

/**
 * Editorial split: the statement stays pinned while imagery drifts past it.
 */
export function Atmosphere() {
  return (
    <section className="relative bg-void py-28 lg:py-40">
      <div className="site-offset grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+64px)] lg:h-fit">
          <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
            About TIMELESS
          </p>
          <RevealText
            as="h2"
            className="mt-6 font-display text-4xl font-light italic leading-[1.05] text-ivory sm:text-6xl"
          >
            A third place where the evening forgets the clock
          </RevealText>
          <RevealText className="mt-8 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
            Every lounge is built around the same promise: considered service,
            a soundtrack that breathes, and a room that flatters everyone in
            it. We design the pause between one day and the next.
          </RevealText>
          <div className="mt-10">
            <ChampagneButton magnetic>Our story</ChampagneButton>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-champagne/12 pt-8">
            {[
              { k: "7", v: "Lounges" },
              { k: "2", v: "Cities" },
              { k: "15h", v: "Open daily" },
            ].map((stat) => (
              <div key={stat.v}>
                <dt className="font-display text-3xl italic text-ivory">
                  {stat.k}
                </dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cream/45">
                  {stat.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {columns.map((col, i) => (
            <figure
              key={col.src}
              className={i % 2 === 1 ? "sm:ml-auto sm:w-[78%]" : "sm:w-[88%]"}
            >
              <RevealImage
                src={col.src}
                alt={col.caption}
                sizes="55vw"
                parallax={col.parallax}
                direction={i % 2 === 1 ? "right" : "up"}
                className={`w-full ${col.className}`}
              />
              <Parallax distance={40}>
                <figcaption className="mt-5 text-[11px] uppercase tracking-[0.26em] text-cream/45">
                  {col.caption}
                </figcaption>
              </Parallax>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
