"use client";

import { useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Subscribes to App Router search param changes without suspending the parent.
 * Render inside <Suspense fallback={null}> next to the tree that needs the string.
 */
export function PortfolioSearchParamsBridge({
  onSearchParamsString,
}: {
  onSearchParamsString: (value: string) => void;
}) {
  const sp = useSearchParams();
  const str = sp.toString();
  useLayoutEffect(() => {
    onSearchParamsString(str);
  }, [str, onSearchParamsString]);
  return null;
}
