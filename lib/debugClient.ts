type DebugLogPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  timestamp?: number;
};

export function logDebugEvent(payload: DebugLogPayload) {
  const body = JSON.stringify({
    ...payload,
    timestamp: payload.timestamp ?? Date.now(),
  });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    const queued = navigator.sendBeacon(
      "/api/debug-log",
      new Blob([body], { type: "application/json" })
    );

    if (queued) {
      return;
    }
  }

  void fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
