import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";
import { validatePaginationParams } from "@/utils/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TRANSACTIONS_URL = buildApiUrl("all_tx");

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  const size = searchParams.get('size');
  const sort = searchParams.get('sort');

  // Validate query parameters
  const validation = validatePaginationParams(page, size, sort);
  if (!validation.valid || !validation.params) {
    return NextResponse.json(
      { message: validation.error || 'Invalid pagination parameters' },
      { status: 400 }
    );
  }

  const { params } = validation;
  const queryParams = `?page=${params.page}&size=${params.size}&sort=${params.sort}`;
  const url = `${TRANSACTIONS_URL}${queryParams}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ message: response.statusText, status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error fetching transactions:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching transactions", 
      error: errorMessage 
    }, { status: 500 });
  }
};

