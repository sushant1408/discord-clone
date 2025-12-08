"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  EditIcon,
  FileIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import qs from "query-string";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { ActionTooltip } from "@/components/action-tooltip";
import { useSocket } from "@/components/providers/socket-provider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import type { Member, Message, Profile } from "@/generated/prisma/client";
import { MemberRole } from "@/generated/prisma/enums";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  id: Message["id"];
  content: Message["content"];
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: Message["fileUrl"];
  fileType?: string;
  deleted: Message["deleted"];
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="size-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlertIcon className="size-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  fileType,
  deleted,
  currentMember,
  isUpdated,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { onOpen } = useDialogStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const { socket } = useSocket();

  useEffect(() => {
    form.reset({
      content,
    });
  }, [form.reset, content]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  const isAdmin = member.role === MemberRole.ADMIN;
  const isModerator = member.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values).then((res) => {
        const updateKey = `chat:${socketQuery?.channelId}:messages:update`;
        socket.emit(updateKey, res.data);
      });
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary size-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="size-10 shrink-0 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (editor)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <>
              <form
                id="form-edit-message"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <Controller
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <Field className="relative w-full">
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="p-2 bg-zinc-200/90! dark:bg-zinc-700/75! border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                        placeholder="Edited message"
                      />
                    </Field>
                  )}
                />
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  form="form-edit-message"
                  disabled={isLoading}
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <EditIcon
                className="cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <TrashIcon
              className="cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export { ChatItem };
