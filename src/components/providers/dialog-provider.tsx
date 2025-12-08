"use client";

import { useEffect, useState } from "react";

import { CreateChannelDialog } from "@/components/dialogs/create-channel-dialog";
import { CreateServerDialog } from "@/components/dialogs/create-server-dialog";
import { DeleteChannelDialog } from "@/components/dialogs/delete-channel-dialog";
import { DeleteMessageDialog } from "@/components/dialogs/delete-message-dialog";
import { DeleteServerDialog } from "@/components/dialogs/delete-server-dialog";
import { EditChannelDialog } from "@/components/dialogs/edit-channel-dialog";
import { EditServerDialog } from "@/components/dialogs/edit-server-dialog";
import { InviteDialog } from "@/components/dialogs/invite-dialog";
import { LeaveServerDialog } from "@/components/dialogs/leave-server-dialog";
import { MembersDialog } from "@/components/dialogs/members-dialog";
import { MessageFileDialog } from "@/components/dialogs/message-file-dialog";

const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerDialog />
      <InviteDialog />
      <EditServerDialog />
      <MembersDialog />
      <CreateChannelDialog />
      <LeaveServerDialog />
      <DeleteServerDialog />
      <DeleteChannelDialog />
      <EditChannelDialog />
      <MessageFileDialog />
      <DeleteMessageDialog />
    </>
  );
};

export { DialogProvider };
