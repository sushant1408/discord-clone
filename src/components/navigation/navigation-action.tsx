"use client";

import { PlusIcon } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useDialogStore } from "@/hooks/use-dialog-store";

const NavigationAction = () => {
  const { onOpen } = useDialogStore();

  const onClick = () => {
    onOpen("createServer");
  };

  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">
        <button
          type="button"
          onClick={onClick}
          className="group flex items-center"
        >
          <div className="flex mx-3 size-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <PlusIcon
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export { NavigationAction };
