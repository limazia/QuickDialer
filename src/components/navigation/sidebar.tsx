"use client";

import { useState } from "react";
import { MoreVerticalIcon, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/lib/axios";
import { Tag as TagProps } from "@/shared/interfaces/tag";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateNewTagDialog } from "@/components/create-new-tag-dialog";
import { DeleteTagAlert } from "@/components/delete-tag-alert";

export function Sidebar() {
  const [createTagDialogOpen, setCreateTagDialogOpen] = useState(false);

  const { data: results, isLoading } = useQuery<TagProps[]>({
    queryKey: ["tags"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await api.get("/api/tags");
      const { data } = response.data;

      return data;
    },
  });

  return (
    <nav className="mt-4 space-y-4">
      <div className="mt-4">
        <div className="w-full flex items-center justify-between">
          <span className="font-semibold">Marcadores</span>

          <Dialog
            open={createTagDialogOpen}
            onOpenChange={setCreateTagDialogOpen}
          >
            <DialogTrigger asChild>
              <Plus
                onSelect={() => {
                  setCreateTagDialogOpen(true);
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </DialogTrigger>

            <CreateNewTagDialog
              onRequestClose={() => {
                setCreateTagDialogOpen(false);
              }}
            />
          </Dialog>
        </div>

        <div className="mt-4">
          {isLoading && !results && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className=" pb-3">
                  <Skeleton className="w-full h-[20px]" />
                </div>
              ))}
            </>
          )}

          {results &&
            results.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between pb-2 transition duration-500 ease"
              >
                <Link
                  className="flex items-center gap-2 text-sm"
                  href={tag.slug}
                >
                  <Tag
                    className="h-4 w-4"
                    style={{
                      color: tag.color,
                    }}
                  />
                  {tag.slug}
                </Link>
                <AlertDialog>
                  <div className="flex items-center gap-2">
                    <small className="text-slate-400">{tag.count}</small>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVerticalIcon className="w-3 h-3 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Link
                              href="#"
                              className="flex items-center font-semibold"
                            >
                              <Pencil className="mr-2 h-3 w-3" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                              <span className="flex items-center font-semibold cursor-pointer">
                                <Trash2 className="mr-2 h-3 w-3" />
                                Excluir
                              </span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <DeleteTagAlert id={tag.id} />
                </AlertDialog>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}
