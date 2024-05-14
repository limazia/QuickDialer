import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { updateContactById, deleteContactById } from "@/database/contacts";

const schema = z.object({
  name: z.string().min(2),
  contact: z.string().min(2),
  tags: z.array(z.string()).min(1),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  const id = String(params.id);
  const body = await request.json();

  const result = schema.safeParse(body);

  if (!id) {
    return NextResponse.json(
      { error: "Contact id is not valid" },
      { status: 400 }
    );
  }

  if (!result.success) {
    return NextResponse.json(
      { error: "Request body is missing one of the needed properties!" },
      { status: 400 }
    );
  }

  const name = result.data.name;
  const contact = result.data.contact;
  const tags = result.data.tags;

  const newContact = await updateContactById(id, name, contact, tags);

  if (!newContact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
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
    return NextResponse.json(
      { error: "Contact id is not valid" },
      { status: 400 }
    );
  }

  await deleteContactById(id);

  return NextResponse.json(
    { message: "Deleted successfully!" },
    { status: 201 }
  );
}
