import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/prisma";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10! mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-12!",
            },
          }}
        />
      </div>
    </div>
  );
};

export { NavigationSidebar };
