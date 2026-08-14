"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

let registered = false;

export function registerMotion() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Draggable,
    InertiaPlugin,
    CustomEase,
    DrawSVGPlugin,
  );

  CustomEase.create("luxe", "0.76, 0, 0.24, 1");
  CustomEase.create("silk", "0.16, 1, 0.3, 1");
  CustomEase.create("drape", "0.22, 1, 0.36, 1");

  gsap.defaults({ ease: "silk", duration: 1.1 });
  registered = true;
}

/** Live scroll telemetry shared between DOM animations and the WebGL scene. */
export const scrollState = {
  velocity: 0,
  progress: 0,
  y: 0,
};

export const PRELOADER_DONE = "timeless:preloader-done";

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin };
