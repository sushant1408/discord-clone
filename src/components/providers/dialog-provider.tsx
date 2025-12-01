"use client";

import { useEffect, useState } from "react";

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
    </>
  );
};

export { DialogProvider };
