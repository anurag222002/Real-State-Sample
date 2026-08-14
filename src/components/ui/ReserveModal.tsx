"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { locations } from "@/lib/data";
import { useUI } from "@/components/providers/AppProviders";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Hoverable } from "@/components/ui/Hoverable";

export function ReserveModal() {
  const { reserveOpen, setReserveOpen } = useUI();
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
          ".reserve-item",
          { autoAlpha: 0, x: 34 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: "drape",
          },
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
    document.body.classList.toggle("modal-open", reserveOpen);
    window.dispatchEvent(
      new Event(reserveOpen ? "timeless:scroll-lock" : "timeless:scroll-unlock"),
    );

    if (!tl) return;
    if (reserveOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.7).reverse();
    }

    if (!reserveOpen) {
      const reset = window.setTimeout(() => setStep("pick"), 500);
      return () => window.clearTimeout(reset);
    }
  }, [reserveOpen]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep("done");
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none invisible fixed inset-0 z-[60] flex justify-end bg-void/55 opacity-0 backdrop-blur-sm"
      onClick={() => setReserveOpen(false)}
    >
      <aside
        ref={panelRef}
        className="h-full w-full max-w-[520px] overflow-y-auto bg-void p-8 text-cream no-scrollbar shadow-[-40px_0_80px_rgba(0,0,0,0.5)] sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reserve-item mb-10 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">
              Reservation
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-ivory">
              {step === "done" ? "Thank you" : "Reserve"}
            </h2>
          </div>
          <Hoverable>
            <button
              onClick={() => setReserveOpen(false)}
              className="text-cream/70 transition-transform duration-500 hover:rotate-90"
              aria-label="Close reservation"
            >
              ✕
            </button>
          </Hoverable>
        </div>

        {step === "pick" ? (
          <>
            <p className="reserve-item mb-8 max-w-sm text-sm leading-relaxed text-cream/65">
              Reserve the space using your preferred method
            </p>
            <div className="flex flex-col gap-8">
              {locations.slice(0, 6).map((loc) => (
                <div
                  key={loc.id}
                  className="reserve-item border-b border-champagne/10 pb-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">
                    {loc.codeName}
                  </p>
                  <p className="mt-1 font-display text-2xl italic text-ivory">
                    {loc.name}
                  </p>
                  <p className="mt-2 text-xs text-cream/50">
                    Phone: {loc.phone}
                  </p>
                  <p className="mt-1 text-xs text-cream/50">
                    Telegram: {loc.telegram}
                  </p>
                  <div className="mt-4">
                    <ChampagneButton onClick={() => setStep("form")}>
                      Reserve
                    </ChampagneButton>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {step === "form" ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-7">
            <p className="reserve-item text-sm text-cream/65">
              Tell us about your plans
            </p>
            <label className="reserve-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Location
              </span>
              <select className="mt-2 w-full border-b border-champagne/25 bg-transparent py-3 text-sm outline-none">
                {locations.map((loc) => (
                  <option key={loc.id} className="bg-void">
                    {loc.codeName} — {loc.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="reserve-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Name
              </span>
              <input className="mt-2 w-full border-b border-champagne/25 bg-transparent py-3 text-sm outline-none" />
            </label>
            <label className="reserve-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Number of persons
              </span>
              <select className="mt-2 w-full border-b border-champagne/25 bg-transparent py-3 text-sm outline-none">
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} className="bg-void">
                    {i === 9
                      ? "10+ people"
                      : `${i + 1} ${i === 0 ? "person" : "people"}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="reserve-item block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne">
                Your wishes
              </span>
              <textarea
                rows={3}
                className="mt-2 w-full resize-none border-b border-champagne/25 bg-transparent py-3 text-sm outline-none"
                placeholder="Tell us about your special wishes"
              />
            </label>
            <div className="reserve-item">
              <ChampagneButton type="submit">Reserve</ChampagneButton>
            </div>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="reserve-item">
            <p className="max-w-sm text-sm leading-relaxed text-cream/70">
              Your reservation has been accepted. We will contact you as soon as
              possible to confirm your booking.
            </p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-champagne">
              With love, TIMELESS
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
