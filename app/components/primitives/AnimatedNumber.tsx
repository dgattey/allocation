"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  format,
  className,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) {
      return;
    }

    const element = spanRef.current;
    if (!element) {
      prevValue.current = value;
      return;
    }

    const flashClass =
      value > prevValue.current
        ? "animate-[flash-positive_600ms_ease-out]"
        : "animate-[flash-negative_600ms_ease-out]";

    prevValue.current = value;
    element.classList.remove(
      "animate-[flash-positive_600ms_ease-out]",
      "animate-[flash-negative_600ms_ease-out]"
    );
    void element.offsetWidth;
    element.classList.add(flashClass);

    const timer = window.setTimeout(() => {
      element.classList.remove(flashClass);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [value]);

  return (
    <span
      ref={spanRef}
      className={cn("tabular-nums transition-colors duration-300", className)}
    >
      {format(value)}
    </span>
  );
}
