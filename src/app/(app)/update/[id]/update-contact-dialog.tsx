"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { api } from "@/shared/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TagInput } from "@/components/tag-input";
import { PhoneInput } from "@/components/phone-input";

const editContactFormSchema = z.object({
  name: z.string().min(1, { message: "Por favor, forneça um nome válido." }),
  contact: z
    .string()
    .min(1, { message: "Por favor, forneça um número válido." }),
  tags: z
    .array(z.string())
    .min(1, "Pelo menos uma tag é necessária.")
    .max(1, "Apenas uma tag é permitida."),
});

type EditContactFormSchema = z.infer<typeof editContactFormSchema>;

interface UpdateContactDialogProps {
  contact: {
    id: string;
    name: string;
    contact: string;
    tags?: string[];
  };
}

export function UpdateContactDialog({ contact }: UpdateContactDialogProps) {
  const { toast } = useToast();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<EditContactFormSchema>({
    resolver: zodResolver(editContactFormSchema),
    defaultValues: {
      name: contact.name,
      contact: contact.contact,
      tags: contact?.tags?.map((tag) => tag) ?? [],
    },
  });

  const { mutateAsync: updateContact } = useMutation({
    mutationFn: async (data: EditContactFormSchema) => {
      await api.put(`/api/contact/${contact.id}`, data);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["contacts", "tags"],
        exact: true,
      });
    },
  });

  async function handleUpdateContact(data: EditContactFormSchema) {
    try {
      await updateContact(data);

      reset();

      toast({
        title: "Contato atualizado com sucesso.",
        variant: "default",
      });

      replace("/");
    } catch {
      toast({
        title: "Ah! Algo deu errado.",
        description:
          "Não foi possível atualizar o contato. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open>
      <DialogPortal>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader className="pb-5">
            <DialogTitle>Editar contato</DialogTitle>
            <DialogDescription>Atualize um contato existente</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleUpdateContact)}
            className="space-y-6"
          >
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Nome do contato</Label>
              <Input
                id="name"
                className="w-full"
                disabled={isSubmitting}
                {...register("name")}
              />

              {errors.name && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="contact">Número</Label>
              <Controller
                control={control}
                name="contact"
                render={({ field }) => {
                  return <PhoneInput {...field} />;
                }}
              />

              {errors.contact && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange } }) => {
                  return (
                    <TagInput
                      value={value}
                      onValueChange={onChange}
                      allowTagCreation={false}
                    />
                  );
                }}
              />

              {errors.tags && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.tags.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="link" onClick={() => replace("/")}>
                Cancelar
              </Button>

              <Button className="w-24" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
