"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import type { PortalShape } from "@/lib/data";
import { cn } from "@/lib/cn";

const shapeClass: Record<PortalShape, string> = {
  tower: "portal-tower",
  arch: "portal-arch",
  plinth: "portal-plinth",
  aperture: "portal-aperture",
  chamfer: "portal-chamfer",
  louvre: "portal-louvre",
  monolith: "portal-monolith",
};

/**
 * An architectural aperture: the image is masked to a building form, framed by
 * survey ticks, and tilts in 3D as the pointer moves across it.
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
        {/* Survey ticks that draw in on hover, like marking up an elevation. */}
        <div className="pointer-events-none absolute inset-[-10px] z-10">
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ].map((corner) => (
            <span
              key={corner}
              className={`absolute h-5 w-5 border-champagne/35 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${corner}`}
            />
          ))}
          <span
            id={`${id}scan`}
            className="absolute inset-x-3 top-1/2 h-px origin-left scale-x-0 bg-bronze/70 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
          />
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
