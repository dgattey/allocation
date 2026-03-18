"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SlidingNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

/**
 * Displays a formatted number. On value change, the old value
 * slides out and new value slides in with a smooth transition.
 */
export function SlidingNumber({ value, format, className }: SlidingNumberProps) {
  const formatted = format(value);
  const prevValue = useRef(value);
  const [display, setDisplay] = useState(formatted);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (prevValue.current === value) {
      if (display === formatted) {
        return;
      }

      const syncFrame = window.requestAnimationFrame(() => {
        setDisplay(formatted);
      });

      return () => window.cancelAnimationFrame(syncFrame);
    }

    const direction = value > prevValue.current ? "up" : "down";
    prevValue.current = value;

    let swapTimer: number | undefined;
    const startFrame = window.requestAnimationFrame(() => {
      setSlideDirection(direction);
      setIsTransitioning(true);

      // After the exit animation, swap the text and slide it back in.
      swapTimer = window.setTimeout(() => {
        setDisplay(formatted);
        setIsTransitioning(false);
      }, 180);
    });

    return () => {
      window.cancelAnimationFrame(startFrame);
      if (swapTimer !== undefined) {
        window.clearTimeout(swapTimer);
      }
    };
  }, [display, formatted, value]);

  return (
    <span
      className={cn("inline-block tabular-nums overflow-hidden", className)}
      aria-label={formatted}
    >
      <span
        className={cn(
          "inline-block transition-all ease-[cubic-bezier(0.16,1,0.3,1)]",
          isTransitioning
            ? slideDirection === "up"
              ? "-translate-y-[30%] opacity-0 blur-[2px]"
              : "translate-y-[30%] opacity-0 blur-[2px]"
            : "translate-y-0 opacity-100 blur-0"
        )}
        style={{
          transitionDuration: isTransitioning ? "150ms" : "300ms",
        }}
      >
        {display}
      </span>
    </span>
  );
}
