"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Vertical drift across the viewport, in pixels. */
  parallax?: number;
  direction?: "up" | "down" | "left" | "right";
};

const clipFrom: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Curtain-style image reveal: the frame unmasks while the picture inside
 * settles from an over-scale, then drifts on scroll for depth.
 */
export function RevealImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "50vw",
  priority,
  parallax = 0,
  direction = "up",
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    registerMotion();

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: frame, start: "top 90%", once: true },
        })
        .fromTo(
          frame,
          { clipPath: clipFrom[direction] },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "luxe" },
        )
        .fromTo(
          img,
          { scale: 1.35 },
          { scale: 1, duration: 1.8, ease: "silk" },
          0,
        );

      if (parallax) {
        gsap.fromTo(
          img,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, frame);

    return () => ctx.revert();
  }, [direction, parallax]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={imgRef} className="absolute inset-[-6%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
