import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createTag, getTagsWithLimitAndOffset } from "@/database/tags";

const schema = z.object({
  slug: z.string().min(2),
  color: z.string(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = String(searchParams.get("q"));
  const pageIndex = Number(searchParams.get("pageIndex"));
  const pageSize = Number(searchParams.get("pageSize"));

  const tags = await getTagsWithLimitAndOffset(q, pageIndex, pageSize);

  return NextResponse.json(tags, { status: 201 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Request body is missing one of the needed properties!" },
      { status: 400 }
    );
  }

  const slug = result.data.slug;
  const color = result.data.color;

  const newTag = await createTag(slug, color);

  if (!newTag) {
    return NextResponse.json({ error: "Tag not created!" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Created successfully!" },
    { status: 201 }
  );
}
