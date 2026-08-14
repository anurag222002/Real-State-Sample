"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import type { PortalShape } from "@/lib/data";
import { cn } from "@/lib/cn";

const shapeClass: Record<PortalShape, string> = {
  rectangle: "portal-rectangle",
  ovals: "portal-ovals",
  square: "portal-square",
  rings: "portal-rings",
  triangles: "portal-triangles",
  trapezoid: "portal-trapezoid",
  eight: "portal-eight",
};

/**
 * A shaped portal: masked image, orbiting champagne ring, and a pointer-driven
 * tilt so each card reacts in 3D the way the reference sliders do.
 */
export function PortalFrame({
  src,
  alt,
  shape,
  className,
  sizes = "40vw",
  reveal = true,
}: {
  src: string;
  alt: string;
  shape: PortalShape;
  className?: string;
  sizes?: string;
  reveal?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const image = imageRef.current;
    if (!root || !inner || !image) return;
    registerMotion();

    const ctx = gsap.context(() => {
      if (reveal) {
        gsap
          .timeline({
            scrollTrigger: { trigger: root, start: "top 88%", once: true },
          })
          .fromTo(
            root,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "luxe" },
          )
          .fromTo(image, { scale: 1.4 }, { scale: 1, duration: 1.7, ease: "silk" }, 0);
      }

      const rotX = gsap.quickTo(inner, "rotateX", {
        duration: 0.7,
        ease: "power3.out",
      });
      const rotY = gsap.quickTo(inner, "rotateY", {
        duration: 0.7,
        ease: "power3.out",
      });
      const scaleTo = gsap.quickTo(image, "scale", {
        duration: 0.9,
        ease: "power3.out",
      });

      const onMove = (e: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotY(px * 12);
        rotX(-py * 12);
      };
      const onEnter = () => scaleTo(1.08);
      const onLeave = () => {
        rotX(0);
        rotY(0);
        scaleTo(1);
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);

      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, [reveal]);

  return (
    <div
      ref={rootRef}
      className={cn("relative [perspective:900px]", className)}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className="pointer-events-none absolute inset-[-7%] z-10 opacity-80 mix-blend-screen">
          <svg viewBox="0 0 92 92" className="spin-slow h-full w-full">
            <circle
              opacity="0.55"
              cx="46"
              cy="46"
              r="44"
              fill="none"
              stroke={`url(#${id}ring)`}
              strokeWidth="1.15"
            />
            <defs>
              <linearGradient id={`${id}ring`} x1="19" y1="92" x2="78" y2="14">
                <stop stopColor="#D5D1CC" stopOpacity="0" />
                <stop offset="0.75" stopColor="#D5D1CC" />
                <stop offset="1" stopColor="#D5D1CC" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className={cn(
            "relative h-full w-full overflow-hidden",
            shapeClass[shape],
          )}
        >
          <div ref={imageRef} className="absolute inset-0">
            <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-void/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(253,247,236,0.18),transparent_60%)]" />
        </div>
      </div>
    </div>
  );
}
