import { Controller, useFormContext } from "react-hook-form";
import { AlertCircle, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PickerColor } from "@/components/picker-color";

interface TagFormProps {
  onSubmit: () => void;
}

export function TagForm({ onSubmit }: TagFormProps) {
  const {
    register,
    control,
    formState: { isSubmitting, errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="tag">Nova tag</Label>

        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="color"
            render={({ field: { name, onChange, value } }) => {
              return (
                <PickerColor name={name} onChange={onChange} value={value} />
              );
            }}
          />

          <Input
            id="slug"
            placeholder="sua-nova-tag"
            className="w-full"
            disabled={isSubmitting}
            {...register("slug")}
          />
        </div>

        <small className="flex items-center gap-1">
          <AlertCircle className="inline h-3 w-3" />
          <span>
            Use os{" "}
            <span className="font-semibold text-accent-foreground">
              exemplos a seguir
            </span>{" "}
            para nomear suas tags:
          </span>

          <ol className="flex items-center gap-1">
            <li>
              <Badge variant="outline">familia</Badge>
            </li>
            <li>
              <Badge variant="outline">amigos</Badge>
            </li>
          </ol>
        </small>

        {errors.tag && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors?.tag?.message?.toString()}
          </p>
        )}

        {errors.color && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors?.color?.message?.toString()}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </DialogTrigger>
        <Button
          className="w-24"
          type="submit"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Criar"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
