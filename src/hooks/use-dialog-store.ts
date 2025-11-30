import { create } from "zustand";

import type { Server } from "@/generated/prisma/client";

export type DialogType = "createServer" | "invite" | "editServer";

interface DialogData {
  server?: Server;
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
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));

export { useDialogStore };
