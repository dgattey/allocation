"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
  animate?: boolean;
}

const POSITIVE_FLASH_CLASS = "animate-[flash-positive_600ms_ease-out]";
const NEGATIVE_FLASH_CLASS = "animate-[flash-negative_600ms_ease-out]";

export function AnimatedNumber({
  value,
  format,
  className,
  animate = true,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const element = spanRef.current;

    if (!animate) {
      prevValue.current = value;
      element?.classList.remove(POSITIVE_FLASH_CLASS, NEGATIVE_FLASH_CLASS);
      return;
    }

    if (prevValue.current === value) {
      return;
    }

    if (!element) {
      prevValue.current = value;
      return;
    }

    const flashClass =
      value > prevValue.current ? POSITIVE_FLASH_CLASS : NEGATIVE_FLASH_CLASS;

    prevValue.current = value;
    element.classList.remove(POSITIVE_FLASH_CLASS, NEGATIVE_FLASH_CLASS);
    void element.offsetWidth;
    element.classList.add(flashClass);

    const timer = window.setTimeout(() => {
      element.classList.remove(flashClass);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [animate, value]);

  return (
    <span
      ref={spanRef}
      className={cn("tabular-nums transition-colors duration-300", className)}
    >
      {format(value)}
    </span>
  );
}
