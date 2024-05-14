import { PlusCircle } from "lucide-react";

import { Header, Sidebar, Logo } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateNewContactDialog } from "@/components/create-new-contact-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen bg-gray-100 text-gray-800 p-4 pt-2 min-w-72 max-w-90">
        <Logo />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-10 rounded-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar contato
            </Button>
          </DialogTrigger>

          <CreateNewContactDialog />
        </Dialog>

        <Sidebar />
      </aside>

      <div className="flex flex-col w-full">
        <header className="mx-6">
          <Header />
        </header>

        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
