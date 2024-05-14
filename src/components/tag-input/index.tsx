import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Circle, Loader2, Tag } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { useDebounceValue } from "@/shared/hooks/useDebounceValue";
import { api } from "@/shared/lib/axios";
import { Tag as TagProps } from "@/shared/interfaces/tag";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CreateNewTagDialog } from "@/components/create-new-tag-dialog";

export interface TagInputProps {
  value: string[];
  onValueChange: (tags: string[]) => void;
  error?: string;
  previewTagsAmount?: number;
  allowTagCreation?: boolean;
}

export function TagInput({
  value,
  onValueChange,
  error,
  previewTagsAmount = 5,
  allowTagCreation = true,
}: TagInputProps) {
  const [createTagDialogOpen, setCreateTagDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchTerm = useDebounceValue(search, 300);

  const {
    data: tagOptions,
    isLoading: isLoadingTagOptions,
    isPending: isPendingTagOptions,
  } = useQuery<TagProps[]>({
    queryKey: ["tags", searchTerm],
    queryFn: async () => {
      const response = await api.get("/api/tag", {
        params: {
          q: searchTerm,
          pageSize: 20,
          pageIndex: 0,
        },
      });
      const { tags, error } = response.data;

      if (error) {
        throw error;
      }

      return tags;
    },
    enabled: open,
  });

  function handleAddTag(tag: string) {
    onValueChange([...value, tag]);
  }

  function handleRemoveTag(tag: string) {
    onValueChange(value.filter((item) => item !== tag));
  }

  return (
    <Dialog open={createTagDialogOpen} onOpenChange={setCreateTagDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            data-error={!!error}
            variant="outline"
            size="sm"
            className="flex h-9 items-center justify-start border-dashed px-2 data-[error=true]:border-red-400 data-[error=true]:bg-red-50"
          >
            <Tag className="ml-1 mr-2 h-3 w-3" />
            <span className="text-xs">Tags</span>

            {!!error && (
              <span className="ml-2 text-xs font-normal">{error}</span>
            )}

            {value.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex gap-1">
                  {value.length > previewTagsAmount ? (
                    <Badge
                      variant="secondary"
                      className="pointer-events-none text-nowrap rounded-sm px-1 font-normal"
                    >
                      {value.length} selecionada
                    </Badge>
                  ) : (
                    value.map((tag) => (
                      <Badge
                        variant="secondary"
                        key={tag}
                        className="pointer-events-none rounded-sm px-1 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Tags"
              onValueChange={setSearch}
              value={search}
            />

            <CommandList>
              <ScrollArea className="h-[240px] w-full">
                <CommandGroup>
                  {allowTagCreation && (
                    <CommandItem
                      onSelect={() => {
                        setCreateTagDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Criar novo
                    </CommandItem>
                  )}

                  {isLoadingTagOptions || isPendingTagOptions ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Carregando tags...</span>
                    </div>
                  ) : tagOptions && tagOptions.length === 0 ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      Nenhuma tag encontrada.
                    </div>
                  ) : (
                    tagOptions &&
                    tagOptions.map((option) => {
                      const isSelected = value.includes(option.slug);

                      return (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => {
                            if (isSelected) {
                              handleRemoveTag(option.slug);
                            } else {
                              handleAddTag(option.slug);
                            }
                          }}
                        >
                          <div
                            className={twMerge(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className={twMerge("h-4 w-4")} />
                          </div>
                          <Circle
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: option.color,
                              color: option.color,
                            }}
                          />

                          <span>{option.slug}</span>
                        </CommandItem>
                      );
                    })
                  )}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {allowTagCreation && (
        <CreateNewTagDialog
          onRequestClose={() => {
            setCreateTagDialogOpen(false);
          }}
        />
      )}
    </Dialog>
  );
}
