import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createContact, getContactsWithLimitAndOffset } from "@/database/contacts";

const schema = z.object({
  name: z.string().min(2),
  contact: z.string().min(2),
  tags: z.array(z.string()).min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = String(searchParams.get("q"));
  const pageIndex = Number(searchParams.get("pageIndex")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const contacts = await getContactsWithLimitAndOffset(q, pageIndex, pageSize);

  return NextResponse.json(contacts, { status: 201 });
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

  const name = result.data.name;
  const contact = result.data.contact;
  const tags = result.data.tags;

  const newContact = await createContact(name, contact, tags);

  if (!newContact) {
    return NextResponse.json({ error: "Contact not created!" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Created successfully!" },
    { status: 201 }
  );
}
