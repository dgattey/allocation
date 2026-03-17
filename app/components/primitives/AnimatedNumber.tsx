"use client";

import { useRef, useEffect, useState } from "react";
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
  const prevValue = useRef(value);
  const [flashClass, setFlashClass] = useState<string | null>(null);

  useEffect(() => {
    if (prevValue.current !== value) {
      const direction = value > prevValue.current ? "positive" : "negative";
      setFlashClass(direction);
      prevValue.current = value;

      const timer = setTimeout(() => setFlashClass(null), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={cn(
        "tabular-nums transition-colors duration-300",
        flashClass === "positive" && "animate-[flash-positive_600ms_ease-out]",
        flashClass === "negative" && "animate-[flash-negative_600ms_ease-out]",
        className
      )}
    >
      {format(value)}
    </span>
  );
}
