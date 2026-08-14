"use client";

import { ElementType } from "react";
import { useRevealText } from "@/hooks/useRevealText";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  scroll?: boolean;
  waitFor?: boolean;
};

export function RevealText({
  as = "p",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger = 0.08,
  duration = 1.25,
  scroll = true,
  waitFor = false,
}: Props) {
  const ref = useRevealText<HTMLElement>({
    type,
    delay,
    stagger,
    duration,
    scroll,
    waitFor,
  });

  const Tag = as as React.ComponentType<{
    ref: React.Ref<HTMLElement>;
    className?: string;
    children?: React.ReactNode;
  }>;

  return (
    <Tag ref={ref} className={cn("invisible", className)}>
      {children}
    </Tag>
  );
}
