import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const levelClasses: Record<HeadingLevel, string> = {
  h1: "font-display text-4xl font-light tracking-tight sm:text-5xl",
  h2: "font-display text-3xl font-normal tracking-tight sm:text-4xl",
  h3: "font-display text-2xl font-normal tracking-tight",
  h4: "text-xl font-semibold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold",
};

export function Heading({
  level = "h2",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = level;
  return (
    <Tag className={cn(levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}
