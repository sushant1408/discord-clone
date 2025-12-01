"use client";

import { useEffect, useState } from "react";

import { CreateChannelDialog } from "@/components/dialogs/create-channel-dialog";
import { CreateServerDialog } from "@/components/dialogs/create-server-dialog";
import { EditServerDialog } from "@/components/dialogs/edit-server-dialog";
import { InviteDialog } from "@/components/dialogs/invite-dialog";
import { MembersDialog } from "@/components/dialogs/members-dialog";

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
    </>
  );
};

export { DialogProvider };
