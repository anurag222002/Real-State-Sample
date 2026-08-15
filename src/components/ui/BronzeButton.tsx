"use client";

import { Hoverable } from "@/components/ui/Hoverable";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  /**
   * Accepted for call-site compatibility only. Buttons no longer take a
   * magnetic pull — the hover response is entirely in place.
   */
  magnetic?: boolean;
};

/**
 * Pill with a rotating bronze gradient edge. The label rolls over itself on
 * hover, which gives the control a small mechanical tick.
 */
export function BronzeButton({
  children,
  onClick,
  type = "button",
  className,
}: Props) {
  return (
    <Hoverable>
      <button
        type={type}
        onClick={onClick}
        className={cn(
          "bronze-border group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-[11px] uppercase tracking-[0.28em] text-ivory transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] active:scale-[0.97]",
          className,
        )}
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-bronze/15 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
        <span className="relative block h-4 overflow-hidden">
          <span className="block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden
            className="block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
          >
            {children}
          </span>
        </span>
      </button>
    </Hoverable>
  );
}
