import { NextResponse } from "next/server";
import type { FidelityPosition } from "@/lib/types";
import { buildPortfolioData } from "@/lib/server/portfolioData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const positions: FidelityPosition[] = body.positions;
    const width: number = body.width || 1200;
    const height: number = body.height || 400;

    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json(
        { error: "No positions provided" },
        { status: 400 }
      );
    }

    const portfolioData = await buildPortfolioData(positions, width, height);

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      {
        error: "Failed to compute portfolio data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
