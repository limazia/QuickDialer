"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

export function ActiveLink({
  children,
  className,
  ...rest
}: { children: React.ReactNode, className?: string } & LinkProps) {
  const { href } = rest;
  const pathName = usePathname();

  const isActive = pathName === href;

  return (
    <Link
      {...rest}
      className={`transition duration-500 ease ${isActive ? "hover:bg-gray-200 bg-gray-300" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}
