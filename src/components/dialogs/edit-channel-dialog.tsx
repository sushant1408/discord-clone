"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelType } from "@/generated/prisma/enums";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { GENERAL_CHANNEL_NAME } from "@/lib/constants";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Channel name is required" })
    .refine((name) => name !== GENERAL_CHANNEL_NAME, {
      error: `Channel name cannot be "${GENERAL_CHANNEL_NAME}"`,
    }),
  type: z.enum(ChannelType),
});

type FormValues = z.infer<typeof formSchema>;

const EditChannelDialog = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useDialogStore();

  const isDialogOpen = isOpen && type === "editChannel";
  const { channel, server } = data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });

      await axios.patch(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {}
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <form id="form-edit-channel" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6">
            <FieldGroup className="gap-8">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-channel-name"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                      className="bg-zinc-300/50! border-0 focus-visible:ring-0 text-black! focus-within:ring-offset-0"
                      placeholder="Enter channel name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel type
                    </FieldLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-300/50! border-0 focus:ring-0! text-black ring-offset-0 focus:ring-offset-0! capitalize outline-none">
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </form>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button
            type="submit"
            form="form-edit-channel"
            disabled={isLoading}
            variant="primary"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditChannelDialog };
