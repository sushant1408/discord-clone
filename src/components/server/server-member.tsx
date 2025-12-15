"use client";

import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import type { Member, Profile, Server } from "@/generated/prisma/client";
import { MemberRole } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlertIcon className="ml-2 size-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="ml-2 size-4 text-indigo-500" />
  ),
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role];

  return (
    <button
      type="button"
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={() =>
        router.push(`/servers/${server.id}/conversations/${member.id}`)
      }
    >
      <UserAvatar src={member.profile.imageUrl} className="size-8 md:size-8" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export { ServerMember };
