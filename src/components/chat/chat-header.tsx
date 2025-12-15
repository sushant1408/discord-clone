import { HashIcon } from "lucide-react";

import { ChatVideoButton } from "@/components/chat/chat-video-button";
import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "@/components/socket-indicator";
import { UserAvatar } from "@/components/user-avatar";
import type { Channel, Profile, Server } from "@/generated/prisma/client";

interface ChatHeaderProps {
  serverId: Server["id"];
  name: Channel["name"] | Profile["name"];
  type: "channel" | "conversation";
  imageUrl?: Profile["imageUrl"];
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <HashIcon className="size-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="size-8 md:size-8 mr-2" />
      )}
      <p className="font-semibold text-base text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export { ChatHeader };
