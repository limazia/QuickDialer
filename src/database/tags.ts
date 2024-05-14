import { cache } from "react";

import { prisma } from "@/shared/lib/prisma";
import { Tag } from "@/shared/interfaces/tag";

export const getTags = cache(async (): Promise<Tag[]> => {
  const tagsRow = await prisma.tag.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      contacts: true,
    },
  });

  const tags: Tag[] = tagsRow.map((tag) => ({
    id: tag.id,
    slug: tag.slug,
    color: tag.color,
    count: tag.contacts.length,
    createdAt: tag.createdAt,
  }));

  return tags;
});

export const getTagsWithLimitAndOffset = cache(
  async (q: string, pageIndex: number, pageSize: number) => {
    const slugSearch = q.length ? { contains: q } : undefined;

    const [tags, count] = await Promise.all([
      prisma.tag.findMany({
        where: {
          slug: slugSearch,
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.tag.count({
        where: {
          slug: slugSearch,
        },
      }),
    ]);

    const pageCount = Math.ceil(count / pageSize) ?? 0;

    return { tags, pageCount };
  }
);

export const createTag = cache(async (slug: string, color: string) => {
  const tag = await prisma.tag.create({
    data: {
      slug,
      color,
    },
  });

  return tag;
});

export const updateTagById = cache(
  async (id: string, name: string, contact: string) => {
    const tag = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        name,
        contact,
      },
    });

    return tag;
  }
);

export const deleteTagById = cache(async (id: string) => {
  await prisma.$transaction(async (prismaClient) => {
    const tag = await prismaClient.tag.findUnique({
      where: {
        id,
      },
      include: {
        contacts: true,
      },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    await Promise.all(
      tag.contacts.map(async (contact) => {
        await prismaClient.contact.update({
          where: { id: contact.id },
          data: {
            tags: {
              disconnect: { id },
            },
          },
        });
      })
    );

    await prismaClient.tag.delete({
      where: {
        id,
      },
    });
  });
});
