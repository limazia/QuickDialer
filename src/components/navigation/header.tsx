"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactFilterSchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
});

type ContactFilterSchema = z.infer<typeof contactFilterSchema>;

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const query = params.get("q");

  const { register, handleSubmit, reset } = useForm<ContactFilterSchema>({
    resolver: zodResolver(contactFilterSchema),
    defaultValues: {
      q: query ?? "",
    },
  });

  function handleFilterContact(data: ContactFilterSchema) {
    if (data.q) {
      params.set("q", data.q);
    } else {
      params.delete("q");
    }

    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }

  function handleClearFilters() {
    params.delete("q");
    params.set("page", "1");

    reset({
      q: "",
    });

    replace(`${pathname}?${params.toString()}`);
  }

  const hasAnyFilter = !!query;

  return (
    <div className="flex h-16 items-centesr justify-between mt-5">
      <form onSubmit={handleSubmit(handleFilterContact)} className="flex items-center gap-x-2">
        <div className="w-[400px] rounded-md border flex items-center px-4 disabled:cursor-not-allowed disabled:opacity-50 focus-within:border focus-within:border-sky-500 transition duration-500 ease">
          <Search className="size-4" />

          <Input
            placeholder="Pesquisa"
            className="h-10 bg-transparent border-none rounded-none shadow-none outline-none focus:outline-none focus-visible:ring-0"
            {...register("q")}
          />
        </div>

        <Button type="submit" variant="secondary" className="h-10">
          <Search className="size-4 mr-2" />
          Filtrar resultados
        </Button>

        {hasAnyFilter && (
          <Button type="button" variant="link" onClick={handleClearFilters}>
            <X className="size-4 mr-2" />
            Limpar filtros
          </Button>
        )}
      </form>
    </div>
  );
}
