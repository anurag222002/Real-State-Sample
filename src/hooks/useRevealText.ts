"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion, SplitText } from "@/lib/motion";

type Options = {
  /** Split granularity. Lines read as editorial, chars read as couture. */
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Start the animation on scroll instead of immediately. */
  scroll?: boolean;
  /** Wait for the preloader handoff before playing. */
  waitFor?: boolean;
  enabled?: boolean;
};

/**
 * Masked type reveal: each line/word/char rises out of its own clipping box
 * with a slight rotation, the way high-end editorial sites animate headlines.
 */
export function useRevealText<T extends HTMLElement>({
  type = "lines",
  delay = 0,
  stagger = 0.08,
  duration = 1.25,
  scroll = true,
  waitFor = false,
  enabled = true,
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    registerMotion();

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let cleanupWait: (() => void) | undefined;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: type === "chars" ? "chars,words,lines" : `${type},lines`,
        mask: type,
        linesClass: "reveal-line",
      });

      const targets =
        type === "chars"
          ? split.chars
          : type === "words"
            ? split.words
            : split.lines;

      gsap.set(el, { autoAlpha: 1 });

      const play = () => {
        tween = gsap.from(targets, {
          yPercent: 118,
          rotate: type === "chars" ? 4 : 2.5,
          duration,
          delay,
          stagger: {
            each: stagger,
            from: "start",
          },
          ease: "drape",
          scrollTrigger: scroll
            ? {
                trigger: el,
                start: "top 88%",
                once: true,
              }
            : undefined,
        });
      };

      if (waitFor && !document.body.classList.contains("is-ready")) {
        const onReady = () => play();
        window.addEventListener("timeless:preloader-done", onReady, {
          once: true,
        });
        cleanupWait = () =>
          window.removeEventListener("timeless:preloader-done", onReady);
      } else {
        play();
      }
    }, el);

    return () => {
      cleanupWait?.();
      tween?.kill();
      split?.revert();
      ctx.revert();
    };
  }, [type, delay, stagger, duration, scroll, waitFor, enabled]);

  return ref;
}
