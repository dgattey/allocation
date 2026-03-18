import { NextResponse } from "next/server";
import { writeDebugLog } from "@/lib/debugServer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      hypothesisId: string;
      location: string;
      message: string;
      data: Record<string, unknown>;
      timestamp: number;
    }>;

    if (
      typeof body.hypothesisId !== "string" ||
      typeof body.location !== "string" ||
      typeof body.message !== "string" ||
      typeof body.timestamp !== "number"
    ) {
      return NextResponse.json({ error: "Invalid debug payload" }, { status: 400 });
    }

    await writeDebugLog({
      hypothesisId: body.hypothesisId,
      location: body.location,
      message: body.message,
      data: body.data ?? {},
      timestamp: body.timestamp,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to write debug log",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
