"use client";

import {
  EditIcon,
  HashIcon,
  LockIcon,
  MicIcon,
  TrashIcon,
  VideoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";
import type { Channel, Server } from "@/generated/prisma/client";
import { ChannelType, MemberRole } from "@/generated/prisma/enums";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { GENERAL_CHANNEL_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: MicIcon,
  [ChannelType.VIDEO]: VideoIcon,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useDialogStore();

  const Icon = iconMap[channel.type];

  return (
    <button
      type="button"
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={() =>
        router.push(`/servers/${server.id}/channels/${channel.id}`)
      }
    >
      <Icon className="flex shrink-0 size-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== GENERAL_CHANNEL_NAME && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <EditIcon
              className="hidden group-hover:block size-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("editChannel", { channel, server });
              }}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <TrashIcon
              className="hidden group-hover:block size-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("deleteChannel", { channel, server });
              }}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === GENERAL_CHANNEL_NAME && role !== MemberRole.GUEST && (
        <LockIcon className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export { ServerChannel };
