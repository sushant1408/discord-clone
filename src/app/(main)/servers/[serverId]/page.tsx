import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { GENERAL_CHANNEL_NAME } from "@/lib/constants";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";

interface ServerIdPageProps {
  params: Promise<{ serverId: string }>;
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  const { redirectToSignIn } = await auth();
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { serverId } = await params;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: GENERAL_CHANNEL_NAME,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== GENERAL_CHANNEL_NAME) {
    return null;
  }

  redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
}
