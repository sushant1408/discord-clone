"use client";

import { VideoIcon, VideoOffIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { ActionTooltip } from "@/components/action-tooltip";

const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    router.push(url);
  };

  const Icon = isVideo ? VideoOffIcon : VideoIcon;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        type="button"
        onClick={onClick}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="size-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export { ChatVideoButton };
