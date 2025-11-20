import { NextResponse } from "next/server";
import { buildApiUrl } from "@/utils/serverEnv";
import { validateId } from "@/utils/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CONTRACT_URL = buildApiUrl("sc");

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const id = params.id;

  // Validate ID parameter
  if (!validateId(id)) {
    return NextResponse.json(
      { message: "Invalid contract ID parameter" },
      { status: 400 }
    );
  }

  const url = `${CONTRACT_URL}/${id}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ message: response.statusText, status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error fetching contract:', errorMessage);
    return NextResponse.json({ 
      message: "Error fetching contract", 
      error: errorMessage 
    }, { status: 500 });
  }
};

