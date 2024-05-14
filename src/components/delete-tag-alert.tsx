"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { api } from "@/shared/lib/axios";

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export function DeleteTagAlert({ id }: { id: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: deleteTag, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/tag/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
        //exact: true,
      });
    },
  });

  async function handleDeleteTag() {
    try {
      await deleteTag();

      toast({
        title: "Tag excluida com sucesso.",
        variant: "default",
      });

      if (cancelButtonRef.current) {
        cancelButtonRef.current.click();
      }
    } catch {
      toast({
        title: "Ah! Algo deu errado.",
        description:
          "Ocorreu um erro ao tentar excluir a tag. Se o erro persistir, entre em contato com um administrador.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Tente novamente"
            disabled={isPending}
            onClick={handleDeleteTag}
          >
            Tente novamente
          </ToastAction>
        ),
      });
    }
  }

  return (
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
          onClick={handleDeleteTag}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
