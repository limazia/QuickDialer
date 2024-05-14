"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CopyIcon,
  Loader2,
  MoreVertical,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

import { api } from "@/shared/lib/axios";

import { CopyButton } from "@/components/copy-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ContactTableRowProps {
  contact: {
    id: string;
    name: string;
    contact: string;
    createdAt: Date;
    tag_slug: string;
    tag_color: string;
  };
}

export function ContactTableRow({ contact }: ContactTableRowProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: deleteContact, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/contact/${contact.id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
        //exact: true,
      });
    },
  });

  async function handleDeleteContact() {
    try {
      await deleteContact();

      toast({
        title: "Contato excluido com sucesso.",
        variant: "default",
      });

      if (cancelButtonRef.current) {
        cancelButtonRef.current.click();
      }
    } catch {
      toast({
        title: "Ah! Algo deu errado.",
        description:
          "Ocorreu um erro ao tentar excluir o contato. Se o erro persistir, entre em contato com um administrador.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Tente novamente"
            disabled={isPending}
            onClick={handleDeleteContact}
          >
            Tente novamente
          </ToastAction>
        ),
      });
    }
  }

  return (
    <AlertDialog>
      <TableRow>
        <TableCell>
          <span className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Tag
                    className="h-4 w-4 mr-2"
                    style={{
                      color: contact.tag_color,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{contact.tag_slug}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {contact.name}{" "}
            <CopyButton textToCopy={contact.name}>
              <CopyIcon className="size-3 ml-1" />
            </CopyButton>
          </span>
        </TableCell>
        <TableCell>
          <span className="flex items-center">
            {contact.contact}{" "}
            <CopyButton textToCopy={contact.contact}>
              <CopyIcon className="size-3 ml-1" />
            </CopyButton>
          </span>
        </TableCell>
        <TableCell>
          {formatDistanceToNow(new Date(contact.createdAt), {
            locale: ptBR,
            addSuffix: true,
          })}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">
                <MoreVertical />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-0">
              <DropdownMenuGroup>
                <DropdownMenuItem className="p-2">
                  <Link
                    href={`update/${contact.id}`}
                    className="w-full flex items-center gap-2 font-semibold"
                  >
                    <Pencil className="size-3" />
                    Editar
                  </Link>
                </DropdownMenuItem>

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="p-2">
                    <span className="w-full flex items-center gap-2 font-semibold cursor-pointer">
                      <Trash2 className="size-3" />
                      Excluir
                    </span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá e removerá
            permanentemente os dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButtonRef}>Cancelar</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="destructive"
            className="w-20"
            onClick={handleDeleteContact}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Excluir"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
