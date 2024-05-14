import { Metadata } from "next";

import { prisma } from "@/shared/lib/prisma";

import { UpdateContactDialog } from "./update-contact-dialog";

interface UpdateContactPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: UpdateContactPageProps): Promise<Metadata> {
  const contactId = params.id;

  const { name } = await prisma.contact.findFirstOrThrow({
    where: { id: contactId },
    select: { name: true },
  });

  return {
    title: `Editando ${name}`,
  };
}

export default async function UpdateContactPage({
  params,
}: UpdateContactPageProps) {
  const contactId = params.id;

  const contact = await prisma.contact.findFirstOrThrow({
    where: {
      id: contactId,
    },
  });

  return (
    <>
      <UpdateContactDialog contact={contact} />
    </>
  );
}
