"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { api } from "@/shared/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TagInput } from "@/components/tag-input";
import { PhoneInput } from "./phone-input";

const newContactFormSchema = z.object({
  name: z.string().min(1, { message: "Por favor, forneça um nome válido." }),
  contact: z
    .string()
    .min(1, { message: "Por favor, forneça um número válido." }),
  tags: z
    .array(z.string())
    .min(1, "Pelo menos uma tag é necessária.")
    .max(1, "Apenas uma tag é permitida."),
});

type NewContactFormSchema = z.infer<typeof newContactFormSchema>;

export function CreateNewContactDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<NewContactFormSchema>({
    resolver: zodResolver(newContactFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      tags: [],
    },
  });

  const { mutateAsync: createContact } = useMutation({
    mutationFn: async (data: NewContactFormSchema) => {
      await api.post("/api/contact", data);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
        //exact: true,
      });
    },
  });

  async function handleCreateContact(data: NewContactFormSchema) {
    try {
      await createContact(data);

      toast({
        title: "Contato criado com sucesso.",
        variant: "default",
      });

      reset();
    } catch {
      toast({
        title: "Ah! Algo deu errado.",
        description:
          "Não foi possível criar o contato. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader className="pb-5">
        <DialogTitle>Novo contato</DialogTitle>
        <DialogDescription>
          Adicione informações de um novo contato
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateContact)} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Nome</Label>
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
            render={({ field: { name, onChange, value, disabled } }) => {
              return (
                <TagInput
                  value={value}
                  onValueChange={onChange}
                  previewTagsAmount={1}
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
          <DialogTrigger asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogTrigger>

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
  );
}
