"use client";

import { useEffect, useState } from "react";

export function useTimeAgo(timestamp: string, refreshMs = 10_000): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), refreshMs);
    return () => window.clearInterval(interval);
  }, [refreshMs]);

  const secondsAgo = Math.floor((now - new Date(timestamp).getTime()) / 1_000);

  if (secondsAgo < 5) {
    return "just now";
  }

  if (secondsAgo < 60) {
    return `${secondsAgo}s ago`;
  }

  return `${Math.floor(secondsAgo / 60)}m ago`;
}
