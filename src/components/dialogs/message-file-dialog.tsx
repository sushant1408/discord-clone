"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { useDialogStore } from "@/hooks/use-dialog-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, { error: "Attachement is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const MessageFileDialog = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useDialogStore();

  const isDialogOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios
        .post(url, { ...values, content: values.fileUrl })
        .then(() => {});

      form.reset();
      router.refresh();
      handleClose();
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
            Add an attachement
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <form id="form-message-file" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6">
            <FieldGroup className="gap-8">
              <Controller
                control={form.control}
                name="fileUrl"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.error}
                    className="flex items-center justify-center text-center"
                  >
                    <FileUpload
                      endpoint="messageFile"
                      value={field.value}
                      onChange={field.onChange}
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
            form="form-message-file"
            disabled={isLoading}
            variant="primary"
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { MessageFileDialog };
