"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

type TransitionValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionValue>({
  navigate: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

const PANELS = 5;

/**
 * Route changes are masked by a panel curtain so pages never hard-cut.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current || href === pathname) return;
      registerMotion();
      busyRef.current = true;

      gsap
        .timeline()
        .set(".curtain-panel", { transformOrigin: "bottom center" })
        .to(".curtain-panel", {
          scaleY: 1,
          duration: 0.7,
          stagger: 0.055,
          ease: "luxe",
        })
        .add(() => router.push(href));
    },
    [pathname, router],
  );

  useEffect(() => {
    registerMotion();
    window.scrollTo(0, 0);

    const tl = gsap
      .timeline({
        onComplete: () => {
          busyRef.current = false;
          ScrollTrigger.refresh();
        },
      })
      .set(".curtain-panel", { transformOrigin: "top center" })
      .to(".curtain-panel", {
        scaleY: 0,
        duration: 0.85,
        stagger: 0.05,
        ease: "luxe",
      });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={rootRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[150] flex"
      >
        {Array.from({ length: PANELS }).map((_, i) => (
          <span
            key={i}
            className="curtain-panel h-full flex-1 scale-y-0 bg-void"
          />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}
