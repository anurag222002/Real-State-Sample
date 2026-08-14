"use client";

import { useId } from "react";

export function PlusIcon({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      width="40"
      height="41"
      viewBox="0 0 40 41"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19.9979 0.28418V40.2842"
        stroke={`url(#${id}v)`}
        strokeWidth="1.0005"
      />
      <path d="M0 20.2822H40" stroke={`url(#${id}h)`} strokeWidth="1.0005" />
      <defs>
        <linearGradient id={`${id}v`} x1="20.5" y1="0.28" x2="20.5" y2="40.28">
          <stop offset="0" stopColor="#FDF7EC" stopOpacity="0" />
          <stop offset="0.245" stopColor="#FDF7EC" stopOpacity="0.55" />
          <stop offset="0.75" stopColor="#FDF7EC" />
          <stop offset="1" stopColor="#FDF7EC" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="19.78" x2="40" y2="19.78">
          <stop offset="0" stopColor="#FDF7EC" stopOpacity="0" />
          <stop offset="0.245" stopColor="#FDF7EC" stopOpacity="0.55" />
          <stop offset="0.75" stopColor="#FDF7EC" />
          <stop offset="1" stopColor="#FDF7EC" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
