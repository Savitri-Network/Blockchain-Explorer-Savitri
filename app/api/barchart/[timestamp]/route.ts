import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";
import { validatePaginationParams, validateId } from "@/utils/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOCK_URL = buildApiUrl("block", "ts");

export const GET = async (req: Request, { params }: { params: { timestamp: string } }) => {
  const timestamp = params.timestamp;

  // Validate timestamp parameter
  if (!validateId(timestamp)) {
    return NextResponse.json(
      { message: "Invalid timestamp parameter" },
      { status: 400 }
    );
  }

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

  const { params: validatedParams } = validation;
  const queryParams = `?sort=${validatedParams.sort}&page=${validatedParams.page}&size=${validatedParams.size}`;
  const url = `${BLOCK_URL}/${timestamp}${queryParams}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ message: response.statusText, status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error fetching barchart data:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching barchart data", 
      error: errorMessage 
    }, { status: 500 });
  }
};

