"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerMotion } from "@/lib/motion";

/** Pull is deliberately shallow and capped so targets never leave their slot. */
const PULL_RATIO = 0.1;
const PULL_LIMIT = 8;

/**
 * Difference-blended cursor that grows into a labelled ring over interactive
 * elements, plus a shallow magnetic pull on free-standing `data-magnetic`
 * display elements. Only the element under the pointer is ever pulled, and
 * every exit path returns it to its laid-out position.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

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
    const pullable = new WeakMap<HTMLElement, boolean>();
    let active: HTMLElement | null = null;

    const getMagnet = (el: HTMLElement) => {
      let entry = magnets.get(el);
      if (!entry) {
        entry = {
          x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
        };
        magnets.set(el, entry);
      }
      return entry;
    };

    // Controls in fixed chrome or inside a form must stay anchored: a drifting
    // header pill or submit button reads as a layout bug, not as motion design.
    const canPull = (el: HTMLElement) => {
      const cached = pullable.get(el);
      if (cached !== undefined) return cached;

      let allowed = !el.closest("form, header, [data-no-magnet]");
      for (
        let node: HTMLElement | null = el;
        allowed && node;
        node = node.parentElement
      ) {
        if (getComputedStyle(node).position === "fixed") allowed = false;
      }

      pullable.set(el, allowed);
      return allowed;
    };

    const release = (el: HTMLElement) => {
      const magnet = magnets.get(el);
      if (!magnet) return;
      magnet.x(0);
      magnet.y(0);
    };

    const releaseAll = () => {
      active = null;
      magnets.forEach((_, el) => release(el));
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

      const hovered = node?.closest<HTMLElement>("[data-magnetic]") ?? null;
      const next = hovered && canPull(hovered) ? hovered : null;

      if (active && active !== next) release(active);
      active = next;
      if (!next) return;

      const rect = next.getBoundingClientRect();
      if (rect.width === 0) return;

      const magnet = getMagnet(next);
      const clamp = gsap.utils.clamp(-PULL_LIMIT, PULL_LIMIT);
      magnet.x(clamp((e.clientX - (rect.left + rect.width / 2)) * PULL_RATIO));
      magnet.y(clamp((e.clientY - (rect.top + rect.height / 2)) * PULL_RATIO));
    };

    const onDown = () => dot.classList.add("is-down");
    const onUp = () => dot.classList.remove("is-down");
    const onLeave = () => {
      dot.classList.add("is-hidden");
      releaseAll();
    };
    const onEnter = () => dot.classList.remove("is-hidden");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", releaseAll);
    window.addEventListener("scroll", releaseAll, { passive: true });
    window.addEventListener("blur", releaseAll);
    window.addEventListener("timeless:scroll-lock", releaseAll);
    window.addEventListener("timeless:scroll-unlock", releaseAll);
    document.addEventListener("visibilitychange", releaseAll);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", releaseAll);
      window.removeEventListener("scroll", releaseAll);
      window.removeEventListener("blur", releaseAll);
      window.removeEventListener("timeless:scroll-lock", releaseAll);
      window.removeEventListener("timeless:scroll-unlock", releaseAll);
      document.removeEventListener("visibilitychange", releaseAll);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      magnets.forEach((_, el) => gsap.set(el, { x: 0, y: 0 }));
      magnets.clear();
    };
  }, [pathname]);

  return (
    <div ref={dotRef} className="cursor-dot">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
