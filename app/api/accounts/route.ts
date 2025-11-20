import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LEDGER_URL = buildApiUrl("ledger");

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  // const currentPage = searchParams.get('page');
  // const rowsPerPage = searchParams.get('size');
  // const sort = searchParams.get('sort');

  // const queryParams = `?page=${currentPage}&size=${rowsPerPage}&sort=${sort}`;
  const url = `${LEDGER_URL}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

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
    console.error('Error fetching accounts:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching accounts", 
      error: errorMessage 
    }, { status: 500 });
  }
};

