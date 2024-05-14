"use client";

import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/lib/axios";
import { Contact } from "@/shared/interfaces/contact";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactTableRow } from "./contacts-table-row";
import { ContactsTableSkeleton } from "./contacts-table-skeleton";
import { ContactsPagination } from "./contacts-pagination";

const pageSearchParams = z.object({
  q: z.string().default(""),
  pageIndex: z.coerce.number().default(0),
  pageSize: z.coerce.number().default(10),
});

type PageSearchParams = z.infer<typeof pageSearchParams>;

export default function Home({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const query = (searchParams?.q || "") as string;

  const query_pagination = pageSearchParams.parse(searchParams);

  const {
    data: results,
    isFetching,
    isLoading,
  } = useQuery<Contact[]>({
    queryKey: ["contacts", query, query_pagination],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await api.get("/api/contact", {
        params: {
          q: query,
          pageSize: query_pagination.pageSize ?? 20,
          pageIndex: query_pagination.pageIndex ?? 0,
        },
      });
  
      const { contacts, error } = response.data;
  
      if (error) {
        throw error;
      }
  
      return contacts;
    },
  });
  
 
  const pageCount = results?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !results && <ContactsTableSkeleton />}

            {results &&
              results.map((contact) => {
                return <ContactTableRow key={contact.id} contact={contact} />;
              })}

            {results && results.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhum contato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        {isFetching ? (
          <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <div />
        )}

        {results && results.length !== 0 && (
          <ContactsPagination
            pageSize={query_pagination.pageSize}
            pageIndex={query_pagination.pageIndex}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
}
