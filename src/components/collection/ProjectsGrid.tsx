"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";
import { projects } from "@/lib/data";
import { PortalFrame } from "@/components/ui/PortalFrame";
import { BronzeButton } from "@/components/ui/BronzeButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { useUI } from "@/components/providers/AppProviders";

const filters = ["All", "Under construction", "New launch", "Delivered"] as const;

export function ProjectsGrid() {
  const { setEnquiryOpen } = useUI();
  const rootRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) =>
            filter === "Delivered"
              ? project.status === "Delivered" ||
                project.status === "Nearing possession"
              : project.status === filter,
          ),
    [filter],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.from(card.querySelectorAll(".project-meta > *"), {
          y: 26,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.06,
          ease: "drape",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [visible]);

  return (
    <section ref={rootRef} className="pb-32">
      <div className="site-offset mb-14 flex flex-wrap items-center gap-6 border-y border-champagne/12 py-5">
        {filters.map((item) => (
          <Hoverable key={item}>
            <button
              onClick={() => setFilter(item)}
              className="relative text-[11px] uppercase tracking-[0.26em] transition-colors duration-500"
              style={{
                color: filter === item ? "#fbf7f0" : "rgba(236,231,222,0.4)",
              }}
            >
              {item}
              <span
                className="absolute -bottom-2 left-0 h-px w-full origin-left bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ transform: `scaleX(${filter === item ? 1 : 0})` }}
              />
            </button>
          </Hoverable>
        ))}
        <span className="ml-auto text-[11px] tracking-[0.22em] text-cream/40">
          {String(visible.length).padStart(2, "0")} developments
        </span>
      </div>

      <div className="site-offset grid gap-x-8 gap-y-24 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((project) => (
          <article key={project.id} className="project-card group">
            <PortalFrame
              src={project.image}
              alt={project.name}
              shape={project.shape}
              className="aspect-[4/5] w-full"
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
            <div className="project-meta mt-7">
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.24em] text-bronze">
                  {project.code}
                </span>
                <span className="h-px flex-1 bg-champagne/15" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
                  {project.status}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl uppercase text-ivory">
                {project.name}
              </h2>
              <p className="mt-2 font-accent text-xl italic text-cream/60">
                {project.typology}
              </p>
              <dl className="mt-5 space-y-2 border-t border-champagne/10 pt-4 text-xs text-cream/50">
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/35">Address</dt>
                  <dd className="text-right">
                    {project.address}, {project.city}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/35">Configuration</dt>
                  <dd className="text-right">{project.configuration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/35">Scale</dt>
                  <dd className="text-right">{project.scale}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/35">RERA</dt>
                  <dd className="text-right">{project.rera}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <BronzeButton magnetic onClick={() => setEnquiryOpen(true)}>
                  Request details
                </BronzeButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
