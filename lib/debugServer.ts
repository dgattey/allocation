import { appendFile } from "fs/promises";

type DebugLogPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  timestamp: number;
};

const DEBUG_LOG_PATH = "/opt/cursor/logs/debug.log";

export async function writeDebugLog(payload: DebugLogPayload) {
  await appendFile(DEBUG_LOG_PATH, `${JSON.stringify(payload)}\n`);
}
