"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useDialogStore } from "@/hooks/use-dialog-store";

const formSchema = z.object({
  name: z.string().min(1, { error: "Server name is required" }),
  imageUrl: z.string().min(1, { error: "Server image is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const EditServerDialog = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useDialogStore();

  const isDialogOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
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
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <form id="form-edit-server" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6">
            <FieldGroup className="gap-8">
              <Controller
                control={form.control}
                name="imageUrl"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.error}
                    className="flex items-center justify-center text-center"
                  >
                    <FileUpload
                      endpoint="serverImage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-server-name"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                      className="bg-zinc-300/50! border-0 focus-visible:ring-0 text-black! focus-within:ring-offset-0"
                      placeholder="Enter server name"
                    />
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
            form="form-edit-server"
            disabled={isLoading}
            variant="primary"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditServerDialog };
