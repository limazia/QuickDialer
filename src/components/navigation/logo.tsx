"use client";

import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center justify-center mb-9 mt-5">
      <Link href="/">
        <h1 className="text-3xl select-none cursor-pointer">
          Quick<span className="font-bold">Dialer</span>
        </h1>
      </Link>
    </div>
  );
}
