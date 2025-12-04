"use client";

import type { Theme } from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import { SmileIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPopover = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker
          theme={resolvedTheme as Theme}
          lazyLoadEmojis
          onEmojiClick={(emoji) => onChange(emoji.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};

export { EmojiPopover };
