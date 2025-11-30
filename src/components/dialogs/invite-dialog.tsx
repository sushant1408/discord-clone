"use client";

import axios from "axios";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useOrigin } from "@/hooks/use-origin";

const InviteDialog = () => {
  const { isOpen, onClose, onOpen, type, data } = useDialogStore();
  const origin = useOrigin();

  const isDialogOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleCopy = async () => {
    try {
      setCopied(true);
      await navigator.clipboard.writeText(inviteUrl);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewInviteLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50! border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleCopy} disabled={isLoading}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>

          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            disabled={isLoading}
            onClick={handleNewInviteLink}
          >
            Generate a new link
            <RefreshCwIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { InviteDialog };
