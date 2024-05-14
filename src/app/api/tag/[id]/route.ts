import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { deleteTagById, updateTagById } from "@/database/tags";

const schema = z.object({
  slug: z.string().min(2),
  color: z.string(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  const id = String(params.id);
  const body = await request.json();

  const result = schema.safeParse(body);

  if (!id) {
    return NextResponse.json({ error: "Tag id is not valid" }, { status: 400 });
  }

  if (!result.success) {
    return NextResponse.json(
      { error: "Request body is missing one of the needed properties!" },
      { status: 400 }
    );
  }

  const slug = result.data.slug;
  const color = result.data.color;

  const newTag = await updateTagById(id, slug, color);

  if (!newTag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Updated successfully!" },
    { status: 201 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  const id = String(params.id);

  if (!id) {
    return NextResponse.json({ error: "Tag id is not valid" }, { status: 400 });
  }

  await deleteTagById(id);

  return NextResponse.json(
    { message: "Deleted successfully!" },
    { status: 201 }
  );
}
