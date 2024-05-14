"use client";

import { useEffect } from "react";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Erro",
};

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl uppercase">
          Ops, algo deu errado!
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Erro inesperado. Por favor, tente novamente mais tarde.
        </p>
      </div>

      <Button onClick={() => reset()} variant="link">
        Tente novamente
      </Button>
    </div>
  );
}
