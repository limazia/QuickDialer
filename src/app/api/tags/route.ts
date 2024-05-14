import { NextRequest, NextResponse } from "next/server";

import { getTags } from "@/database/tags";

export async function GET(request: NextRequest) {
  const tags = await getTags();

  return NextResponse.json({ data: tags }, { status: 201 });
}
