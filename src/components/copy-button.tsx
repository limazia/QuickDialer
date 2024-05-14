"use client";

import { ComponentProps, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";

export interface CopyButtonProps extends ComponentProps<"span"> {
  textToCopy: string;
}

export function CopyButton({ textToCopy, ...props }: CopyButtonProps) {
  const { toast } = useToast();

  const [wasCopiedRecently, setWasCopiedRecently] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout>();

  function handleCopy() {
    clearTimeout(copyTimeoutRef.current);

    navigator.clipboard.writeText(textToCopy);

    setWasCopiedRecently(true);

    copyTimeoutRef.current = setTimeout(() => {
      setWasCopiedRecently(false);
    }, 2000);

    toast({
      title: "Copiado com sucesso!",
      variant: "default",
    });
  }

  return (
    <span
      role="button"
      data-highlight={wasCopiedRecently}
      onClick={handleCopy}
      className="flex items-center"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{props.children}</TooltipTrigger>
          <TooltipContent>
            <p>Copiar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}
