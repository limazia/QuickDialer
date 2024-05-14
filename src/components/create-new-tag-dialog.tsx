import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/shared/lib/axios";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { TagForm } from "./tag-input/tag-form";

const newTagFormSchema = z.object({
  slug: z
    .string({
      required_error: "O nome da tag é obrigatório.",
    })
    .regex(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
      message: "Use apenas letras e hífens.",
    }),
  color: z
    .string({
      required_error: "A cor é obrigatório.",
    })
    .min(4, {
      message: "A cor precisa de pelo menos 4 caracteres.",
    }),
});

type NewTagFormSchema = z.infer<typeof newTagFormSchema>;

interface CreateNewTagDialogProps {
  onRequestClose?: () => void;
}

export function CreateNewTagDialog({
  onRequestClose,
}: CreateNewTagDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tagForm = useForm<NewTagFormSchema>({
    resolver: zodResolver(newTagFormSchema),
    defaultValues: {
      slug: "",
      color: "#E2E2E2",
    },
  });

  const { handleSubmit, reset } = tagForm;

  const { mutateAsync: createTag } = useMutation({
    mutationFn: async (data: NewTagFormSchema) => {
      await api.post("/api/tag", data);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
        exact: true,
      });
    },
  });

  async function handleCreateTag(data: NewTagFormSchema) {
    try {
      await createTag(data);

      reset();

      onRequestClose?.();
    } catch (err) {
      toast({
        title: "Ah! Algo deu errado.",
        description:
          "Ocorreu um erro ao tentar criar a tag. Talvez você esteja tentando criar uma tag duplicada.",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="outline-none sm:max-w-[520px]">
      <DialogHeader className="pb-5">
        <DialogTitle>Criar nova tag</DialogTitle>
        <DialogDescription>
          Lembre-se de evitar criar tags desnecessariamente e manter no máximo{" "}
          <span className="font-semibold text-accent-foreground">
            1 tag por contato
          </span>
          .
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...tagForm}>
        <TagForm onSubmit={handleSubmit(handleCreateTag)} />
      </FormProvider>
    </DialogContent>
  );
}
