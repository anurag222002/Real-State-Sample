"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Pixels of travel across the full scroll pass. Negative moves against scroll. */
  distance?: number;
  rotate?: number;
};

export function Parallax({
  children,
  className,
  distance = 120,
  rotate = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance / 2, rotate: -rotate },
        {
          y: -distance / 2,
          rotate,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [distance, rotate]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
