"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  decimals?: number;
};

/** Odometer-style stat that counts up the first time it enters the viewport. */
export function Counter({ value, suffix = "", className, decimals }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerMotion();

    const places = decimals ?? (Number.isInteger(value) ? 0 : 1);

    const ctx = gsap.context(() => {
      const state = { value: 0 };
      gsap.to(state, {
        value,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = state.value.toFixed(places);
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [value, decimals]);

  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
