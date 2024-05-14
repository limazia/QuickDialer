"use client";

import { Metadata } from "next";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-8 text-center">
      <div className="space-y-4">
        <h1 className=" font-bold tracking-tighter text-8xl uppercase">404</h1>
        <h2 className="max-w-[600px] text-gray-500 text-xl">
          A página que você procura não existe.
        </h2>
      </div>

      <Link
        className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition duration-500 ease hover:opacity-70"
        href="/"
      >
        <MoveLeft className="w-4 h-4 mr-2" />
        Voltar para o início
      </Link>
    </div>
  );
}
