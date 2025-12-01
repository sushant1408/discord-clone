import {
  HashIcon,
  MicIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChannelType,
  MemberRole,
  type Server,
} from "@/generated/prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";

interface ServerSidebarProps {
  serverId: Server["id"];
}

const iconMap = {
  [ChannelType.TEXT]: <HashIcon className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <MicIcon className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <VideoIcon className="mr-2 size-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlertIcon className="mr-2 size-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="mr-2 size-4 text-indigo-500" />
  ),
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col w-full h-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export { ServerSidebar };
