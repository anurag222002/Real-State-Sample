"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerMotion, ScrollTrigger, scrollState } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    registerMotion();

    const lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      lerp: 0.085,
    });

    lenis.on(
      "scroll",
      ({
        velocity,
        progress,
        scroll,
      }: {
        velocity: number;
        progress: number;
        scroll: number;
      }) => {
        scrollState.velocity = velocity;
        scrollState.progress = progress;
        scrollState.y = scroll;
        ScrollTrigger.update();
      },
    );

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("timeless:scroll-lock", stop);
    window.addEventListener("timeless:scroll-unlock", start);

    lenis.stop();
    const onReady = () => lenis.start();
    window.addEventListener("timeless:preloader-done", onReady, { once: true });

    return () => {
      gsap.ticker.remove(ticker);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("timeless:scroll-lock", stop);
      window.removeEventListener("timeless:scroll-unlock", start);
      window.removeEventListener("timeless:preloader-done", onReady);
      lenis.destroy();
    };
  }, []);

  return null;
}
