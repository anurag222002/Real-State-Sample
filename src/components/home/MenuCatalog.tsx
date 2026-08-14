"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import { menuCategories } from "@/lib/data";
import { PlusIcon } from "@/components/ui/PlusIcon";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";

/**
 * Pinned catalog. Each category wipes over the previous one on scroll while its
 * cards stagger up, mirroring the reference's food catalog sequence.
 */
export function MenuCatalog() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    registerMotion();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".catalog-panel");

      gsap.set(panels.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });

      panels.forEach((panel, index) => {
        const image = panel.querySelector(".catalog-image");
        const cards = panel.querySelectorAll(".catalog-card");

        if (index > 0) {
          tl.to(
            panel,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "luxe",
            },
            index - 1,
          )
            .fromTo(
              image,
              { scale: 1.28 },
              { scale: 1, duration: 1.2, ease: "silk" },
              index - 1,
            )
            .fromTo(
              cards,
              { yPercent: 26, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.6,
                stagger: 0.07,
                ease: "drape",
              },
              index - 1 + 0.4,
            );
        }
      });

      gsap.utils.toArray<HTMLElement>(".catalog-panel").forEach((panel) => {
        gsap.to(panel.querySelector(".catalog-title"), {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            setActive(
              Math.min(
                menuCategories.length - 1,
                Math.floor(self.progress * 0.999 * menuCategories.length),
              ),
            );
          },
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="menu" ref={wrapRef} className="relative h-[340vh] bg-void">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {menuCategories.map((category, index) => (
          <div
            key={category.slug}
            className="catalog-panel absolute inset-0 grid grid-cols-1 bg-void lg:grid-cols-[1.05fr_0.95fr]"
            style={{ zIndex: index + 1 }}
          >
            <div className="relative hidden h-full overflow-hidden lg:block">
              <div className="catalog-image absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="55vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-void/25 via-void/10 to-void/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Hoverable>
                  <button
                    data-magnetic
                    className="catalog-title group flex flex-col items-center gap-6"
                  >
                    <span className="font-display text-6xl italic text-ivory xl:text-7xl">
                      {category.name}
                    </span>
                    <span className="transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-[135deg]">
                      <PlusIcon />
                    </span>
                  </button>
                </Hoverable>
              </div>
            </div>

            <div className="relative flex h-full flex-col justify-between px-[var(--offset-x)] py-[calc(var(--header-height)+16px)] lg:py-24">
              <div className="lg:hidden">
                <p className="font-display text-5xl italic text-ivory">
                  {category.name}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">
                  {category.specialTitle}
                </p>
                <RevealText
                  className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70"
                  scroll={false}
                  delay={0.1}
                >
                  {category.specialDescription}
                </RevealText>
              </div>

              <div className="mt-8 grid flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-3">
                {category.products.map((product) => (
                  <article
                    key={product.name}
                    className="catalog-card group relative min-h-[210px] overflow-hidden"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="30vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                      <h3 className="text-[12px] uppercase tracking-[0.2em] text-ivory">
                        {product.name}
                      </h3>
                      {product.showPrice && product.price ? (
                        <p className="mt-1 text-[11px] text-champagne">
                          {product.price}
                        </p>
                      ) : null}
                      <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-cream/65">
                        {product.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <Hoverable>
                <a
                  href="#menu"
                  data-cursor-label="Open"
                  className="group relative mt-6 flex h-24 items-end overflow-hidden sm:h-32"
                >
                  <Image
                    src={category.menuImage}
                    alt={category.btnLabel}
                    fill
                    sizes="50vw"
                    className="object-cover opacity-60 transition-[opacity,transform] duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105 group-hover:opacity-80"
                  />
                  <span className="relative z-10 p-4 text-[12px] uppercase tracking-[0.28em] text-ivory">
                    {category.btnLabel}
                  </span>
                </a>
              </Hoverable>
            </div>
          </div>
        ))}

        <div className="absolute bottom-[var(--offset-bottom)] left-1/2 z-20 flex -translate-x-1/2 items-center gap-8">
          {menuCategories.map((item, index) => (
            <span
              key={item.slug}
              className="relative text-[11px] uppercase tracking-[0.28em] transition-colors duration-500"
              style={{ color: index === active ? "#fdf7ec" : "rgba(242,239,233,0.35)" }}
            >
              {item.name}
              <span
                className="absolute -bottom-2 left-0 h-px w-full origin-left bg-champagne transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ transform: `scaleX(${index === active ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
