"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { EmojiPopover } from "@/components/emoji-popover";
import { useSocket } from "@/components/providers/socket-provider";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDialogStore } from "@/hooks/use-dialog-store";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const router = useRouter();

  const { socket } = useSocket();
  const { onOpen } = useDialogStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values).then((res) => {
        const channelKey = `chat:${type === "conversation" ? query?.conversationId : query?.channelId}:messages`;
        socket.emit(channelKey, res.data);
      });

      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form id="form-chat" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <div className="relative p-4 pb-6">
            <button
              type="button"
              onClick={() => onOpen("messageFile", { apiUrl, query })}
              className="absolute top-7 left-8 size-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
            >
              <PlusIcon className="text-white dark:text-[#313338]" />
            </button>
            <Field>
              <Input
                {...field}
                disabled={isLoading}
                className="px-14 py-6 bg-zinc-200/90! dark:bg-zinc-700/75! border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                placeholder={`Message ${
                  type === "conversation" ? name : `#${name}`
                }`}
              />
            </Field>
            <div className="absolute top-7 right-8">
              <EmojiPopover
                onChange={(emoji) => field.onChange(`${field.value} ${emoji}`)}
              />
            </div>
          </div>
        )}
      />
    </form>
  );
};

export { ChatInput };
