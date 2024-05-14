import { cache } from "react";

import { prisma } from "@/shared/lib/prisma";

export const getContactsWithLimitAndOffset = cache(
  async (q: string, pageIndex: number, pageSize: number) => {
    const filter = q.length
      ? {
          OR: [{ name: { contains: q } }, { contact: { contains: q } }],
        }
      : undefined;

    const [contacts, count] = await Promise.all([
      prisma.contact.findMany({
        where: filter,
        include: {
          tags: {
            select: {
              slug: true,
              color: true,
            },
          },
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contact.count({
        where: filter,
      }),
    ]);

    const mappedContacts = contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      contact: contact.contact,
      createdAt: contact.createdAt,
      tag_slug: contact.tags.length > 0 ? contact.tags[0].slug : null,
      tag_color: contact.tags.length > 0 ? contact.tags[0].color : null,
    }));

    const pageCount = Math.ceil(count / pageSize);

    return { contacts: mappedContacts, pageCount };
  }
);

export const createContact = cache(
  async (name: string, contact: string, tags: string[]) => {
    const contactRow = await prisma.contact.create({
      data: {
        name,
        contact,
        tags: {
          connect: tags.map((tag) => {
            return {
              slug: tag,
            };
          }),
        },
      },
    });

    return contactRow;
  }
);

export const updateContactById = cache(
  async (id: string, name: string, contact: string, tags: string[]) => {
    const contactRow = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        name,
        contact,
        tags: {
          connect: tags.map((tag) => {
            return {
              slug: tag,
            };
          }),
        },
      },
    });

    return contactRow;
  }
);

export const deleteContactById = cache(async (id: string) => {
  await prisma.contact.delete({
    where: {
      id,
    },
  });
});
