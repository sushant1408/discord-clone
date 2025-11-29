import { create } from "zustand";

export type DialogType = "createServer";

type DialogStoreState = {
  type: DialogType | null;
  isOpen: boolean;
};

type DialogStoreActions = {
  onOpen: (type: DialogType) => void;
  onClose: () => void;
};

type DialogStore = DialogStoreState & DialogStoreActions;

const useDialogStore = create<DialogStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}));

export { useDialogStore };
