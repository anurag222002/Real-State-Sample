"use client";

import { Hoverable } from "@/components/ui/Hoverable";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
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
  magnetic,
}: Props) {
  return (
    <Hoverable>
      <button
        type={type}
        onClick={onClick}
        {...(magnetic ? { "data-magnetic": "" } : {})}
        className={cn(
          "bronze-border group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-[11px] uppercase tracking-[0.28em] text-ivory",
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
