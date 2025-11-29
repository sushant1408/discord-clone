"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

const ActionTooltip = ({
  align,
  children,
  label,
  side,
}: ActionTooltipProps) => {
  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p className="font-semibold text-sm capitalize">
          {label.toLowerCase()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export { ActionTooltip };
