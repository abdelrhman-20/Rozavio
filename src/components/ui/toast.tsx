"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss: () => void;
  /** Auto-dismiss delay in ms. Set to 0 to disable. */
  duration?: number;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-2.5 w-2.5"
    >
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-2.5 w-2.5"
    >
      <path d="M10 6.5v4.25" />
      <path d="M10 13.5h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="h-2.5 w-2.5"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

/**
 * A single toast notification.
 *
 * Mounts in a hidden state and transitions in on the next frame — one
 * deliberate entrance rather than an always-visible element — then
 * auto-dismisses after `duration`. The exit transition runs before
 * `onDismiss` unmounts the toast so it never disappears abruptly.
 */
export function Toast({
  message,
  variant = "success",
  onDismiss,
  duration = 4500,
}: ToastProps) {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(onDismiss, 200);
    return () => clearTimeout(timer);
  }, [leaving, onDismiss]);

  const visible = entered && !leaving;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        // Compact, intrinsically-sized card — not a full-width bar. The
        // shadow is tinted with the ink color (not flat black) and
        // layered (tight contact shadow + soft ambient falloff) so it
        // reads as lifted rather than a generic drop-shadow.
        "pointer-events-auto flex w-auto max-w-[280px] items-center gap-2 rounded-md border-y border-r border-border border-l-2 bg-background py-2 pl-2.5 pr-1.5 transition-all duration-200 ease-out",
        "shadow-[0_1px_2px_rgba(20,32,28,0.06),0_6px_16px_-4px_rgba(20,32,28,0.16)]",
        variant === "success" ? "border-l-primary" : "border-l-destructive",
        visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
          variant === "success"
            ? "bg-primary/15 text-primary"
            : "bg-destructive/15 text-destructive",
        )}
      >
        {variant === "success" ? <CheckIcon /> : <AlertIcon />}
      </span>
      <p className="flex-1 text-[13px] font-medium leading-snug text-foreground">
        {message}
      </p>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/**
 * Fixed viewport that stacks toasts in the bottom-right corner.
 * `pointer-events-none` on the container keeps the empty margin
 * around toasts from blocking clicks on the page beneath it.
 */
export function ToastViewport({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {children}
    </div>
  );
}
