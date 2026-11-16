import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type TextVariant = "default" | "muted" | "lead" | "small";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
}

const variantClasses: Record<TextVariant, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  lead: "text-lg text-muted-foreground",
  small: "text-sm text-muted-foreground",
};

export function Text({ variant = "default", className, ...props }: TextProps) {
  return (
    <p className={cn("leading-relaxed", variantClasses[variant], className)} {...props} />
  );
}
