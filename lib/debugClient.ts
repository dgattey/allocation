type DebugLogPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  timestamp?: number;
};

export function logDebugEvent(payload: DebugLogPayload) {
  void fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      timestamp: payload.timestamp ?? Date.now(),
    }),
    keepalive: true,
  }).catch(() => undefined);
}
