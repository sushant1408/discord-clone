import { create } from "zustand";

import type { Channel, ChannelType, Server } from "@/generated/prisma/client";

export type DialogType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel";

interface DialogData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
}

type DialogStoreState = {
  type: DialogType | null;
  data: DialogData;
  isOpen: boolean;
};

type DialogStoreActions = {
  onOpen: (type: DialogType, data?: DialogData) => void;
  onClose: () => void;
};

type DialogStore = DialogStoreState & DialogStoreActions;

const useDialogStore = create<DialogStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));

export { useDialogStore };
