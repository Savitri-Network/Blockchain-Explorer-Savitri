import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LEDGER_URL = buildApiUrl("ledger");

export const GET = async (req: Request) => {
  try {
    const response = await fetch(LEDGER_URL, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ message: response.statusText, status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error fetching userchart data:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching userchart data", 
      error: errorMessage 
    }, { status: 500 });
  }
};

