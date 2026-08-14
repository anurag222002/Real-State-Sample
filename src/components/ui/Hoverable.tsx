"use client";

import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/cn";

export function Hoverable({
  children,
  className,
}: {
  children: React.ReactElement<{
    className?: string;
    "data-cursor"?: string;
  }>;
  className?: string;
}) {
  if (!isValidElement(children)) return children;

  return cloneElement(children, {
    className: cn(children.props.className, className),
    "data-cursor": "hover",
  });
}
