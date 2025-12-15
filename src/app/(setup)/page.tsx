import { redirect } from "next/navigation";

import { InitialDialog } from "@/components/dialogs/initial-dialog";
import { initialProfile } from "@/lib/initial-profile";
import prisma from "@/lib/prisma";

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return <InitialDialog />;
}
