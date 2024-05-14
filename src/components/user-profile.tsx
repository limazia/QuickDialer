import { LogOut } from "lucide-react";
import Image from "next/image";

import { auth, signOut } from "@/auth";
import { getNameInitials } from "@/shared/utils/get-name-initials";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
 
export async function UserProfile() {
  const session = await auth();

  async function handleSignOut() {
    "use server";

    await signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Avatar>
          {session?.user && session?.user.image ? (
            <Image
              className="h-full w-full rounded-[inherit] object-cover"
              src={session.user.image}
              width={48}
              height={48}
              alt=""
            />
          ) : (
            <div className="aspect-square h-full w-full bg-accent" />
          )}

          {session?.user && session?.user.name && (
            <AvatarFallback>
              {getNameInitials(session?.user?.name)}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[10px] w-[calc(100vw-30px)] max-w-[230px] animate-slide-up-and-fade overflow-hidden mt-5"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="line-clamp-1 text-sm text-black font-bold">
              {session?.user?.name}
            </span>

            <span className="line-clamp-1 text-xs text-gray-500">
              {session?.user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={handleSignOut}>
          <DropdownMenuItem className="flex items-center gap-2" asChild>
            <button
              type="submit"
              className="w-full font-semibold text-red-500 dark:text-red-400 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
