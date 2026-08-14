"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { budgets, projects } from "@/lib/data";
import { useUI } from "@/components/providers/AppProviders";
import { BronzeButton } from "@/components/ui/BronzeButton";
import { Hoverable } from "@/components/ui/Hoverable";

/** Slide-over enquiry desk: pick a development, then leave details. */
export function EnquiryPanel() {
  const { enquiryOpen, setEnquiryOpen } = useUI();
  const [step, setStep] = useState<"pick" | "form" | "done">("pick");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    registerMotion();

    const ctx = gsap.context(() => {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .set(root, { pointerEvents: "auto" })
        .to(root, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(
          panel,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.9, ease: "luxe" },
          0,
        )
        .fromTo(
          ".enquiry-item",
          { autoAlpha: 0, x: 34 },
          { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.05, ease: "drape" },
          0.32,
        );
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [step]);

  useEffect(() => {
    const tl = timelineRef.current;
    document.body.classList.toggle("modal-open", enquiryOpen);
    window.dispatchEvent(
      new Event(enquiryOpen ? "timeless:scroll-lock" : "timeless:scroll-unlock"),
    );

    if (!tl) return;
    if (enquiryOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.7).reverse();
      const reset = window.setTimeout(() => setStep("pick"), 520);
      return () => window.clearTimeout(reset);
    }
  }, [enquiryOpen]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep("done");
  };

  const fieldClass =
    "mt-2 w-full border-b border-champagne/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors duration-500 focus:border-bronze";

  return (
    <div
      ref={rootRef}
      className="pointer-events-none invisible fixed inset-0 z-[60] flex justify-end bg-void/60 opacity-0 backdrop-blur-sm"
      onClick={() => setEnquiryOpen(false)}
    >
      <aside
        ref={panelRef}
        className="h-full w-full max-w-[540px] overflow-y-auto bg-graphite p-8 text-cream no-scrollbar shadow-[-40px_0_80px_rgba(0,0,0,0.5)] sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="enquiry-item mb-10 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">
              Enquiry desk
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase text-ivory">
              {step === "done" ? "Thank you" : "Request details"}
            </h2>
          </div>
          <Hoverable>
            <button
              onClick={() => setEnquiryOpen(false)}
              className="text-cream/70 transition-transform duration-500 hover:rotate-90"
              aria-label="Close enquiry panel"
            >
              ✕
            </button>
          </Hoverable>
        </div>

        {step === "pick" ? (
          <>
            <p className="enquiry-item mb-8 max-w-sm text-sm leading-relaxed text-cream/65">
              Choose a development and our sales desk will share the price sheet,
              floor plates and current construction status.
            </p>
            <div className="flex flex-col gap-7">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="enquiry-item border-b border-champagne/10 pb-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] tracking-[0.24em] text-bronze">
                      {project.code}
                    </span>
                    <span className="h-px flex-1 bg-champagne/15" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl uppercase text-ivory">
                    {project.name}
                  </p>
                  <p className="mt-1 text-xs text-cream/50">
                    {project.configuration}
                  </p>
                  <div className="mt-4">
                    <BronzeButton onClick={() => setStep("form")}>
                      Select
                    </BronzeButton>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {step === "form" ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-7">
            <p className="enquiry-item text-sm text-cream/65">
              Tell us what you are looking for
            </p>
            <label className="enquiry-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Development
              </span>
              <select className={fieldClass}>
                {projects.map((project) => (
                  <option key={project.id} className="bg-graphite">
                    {project.name} — {project.city}
                  </option>
                ))}
              </select>
            </label>
            <label className="enquiry-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Name
              </span>
              <input className={fieldClass} />
            </label>
            <label className="enquiry-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Phone
              </span>
              <input type="tel" className={fieldClass} />
            </label>
            <label className="enquiry-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Budget
              </span>
              <select className={fieldClass}>
                {budgets.map((budget) => (
                  <option key={budget} className="bg-graphite">
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label className="enquiry-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Notes
              </span>
              <textarea
                rows={3}
                className={`${fieldClass} resize-none`}
                placeholder="Preferred floor, view, possession timeline"
              />
            </label>
            <div className="enquiry-item">
              <BronzeButton type="submit">Send enquiry</BronzeButton>
            </div>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="enquiry-item">
            <p className="max-w-sm text-sm leading-relaxed text-cream/70">
              Your enquiry has been received. A relationship manager will call
              you within one working day with the price sheet and a site visit
              slot.
            </p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-bronze">
              Meridian sales desk
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
