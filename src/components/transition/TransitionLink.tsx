"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { useTransition } from "@/components/transition/PageTransition";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.ComponentProps<typeof Link>, "href" | "onClick">;

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || href.startsWith("http")) return;
    e.preventDefault();
    onClick?.();
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.replace(/^\/?#/, "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
