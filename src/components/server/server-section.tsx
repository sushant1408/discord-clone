"use client";

import { PlusIcon, SettingsIcon } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useDialogStore } from "@/hooks/use-dialog-store";
import type { ServerWithMembersWithProfiles } from "@/lib/types";
import { type ChannelType, MemberRole } from "../../generated/prisma/enums";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useDialogStore();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            type="button"
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <PlusIcon className="size-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage members" side="top">
          <button
            type="button"
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("members", { server })}
          >
            <SettingsIcon className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export { ServerSection };
