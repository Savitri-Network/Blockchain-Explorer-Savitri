import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATS_URL = buildApiUrl("info");

export const GET = async (req: Request) => {
  try {
    const response = await fetch(STATS_URL, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({
        message: response.statusText,
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error fetching stats:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching stats", 
      error: errorMessage 
    }, { status: 500 });
  }
};


