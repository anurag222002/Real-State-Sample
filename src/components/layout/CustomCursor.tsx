"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";

/**
 * Difference-blended cursor that grows into a labelled ring over interactive
 * elements, plus magnetic pull on anything marked `data-magnetic`.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;
    if (window.matchMedia("(hover: none)").matches) return;

    registerMotion();

    const xTo = gsap.quickTo(dot, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.32, ease: "power3.out" });

    const magnets = new Map<
      HTMLElement,
      { x: (v: number) => void; y: (v: number) => void }
    >();

    const getMagnet = (el: HTMLElement) => {
      let entry = magnets.get(el);
      if (!entry) {
        entry = {
          x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }),
        };
        magnets.set(el, entry);
      }
      return entry;
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const node = e.target as HTMLElement | null;
      const interactive = node?.closest<HTMLElement>(
        "[data-cursor='hover'], a, button",
      );
      const labelText =
        node?.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ??
        "";

      dot.classList.toggle("is-hover", Boolean(interactive));
      dot.classList.toggle("is-labelled", Boolean(labelText));
      if (label.textContent !== labelText) label.textContent = labelText;

      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) return;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const radius = Math.max(rect.width, rect.height) * 1.1 + 60;
          const distance = Math.hypot(dx, dy);
          const magnet = getMagnet(el);

          if (distance < radius) {
            const pull = (1 - distance / radius) * 0.32;
            magnet.x(dx * pull);
            magnet.y(dy * pull);
          } else {
            magnet.x(0);
            magnet.y(0);
          }
        });
    };

    const onDown = () => dot.classList.add("is-down");
    const onUp = () => dot.classList.remove("is-down");
    const onLeave = () => dot.classList.add("is-hidden");
    const onEnter = () => dot.classList.remove("is-hidden");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      magnets.forEach((_, el) => gsap.set(el, { x: 0, y: 0 }));
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor-dot">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
