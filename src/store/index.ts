import { TFile } from "obsidian";
import { create } from "zustand";

interface State {
  notes: TFile[];
  currentActiveFilePath: string;
  currentActiveFolderPath: string;
  forceFilesyetemUpdate: number;
  forceNotesViewUpdate: number;
  setNotes: (notes: TFile[]) => void;
  setCurrentActiveFilePath: (file: string | null) => void;
  setCurrentActiveFolderPath: (folder: string | null) => void;
  setForceFilesystemUpdate: () => void;
  setForceNotesViewUpdate: () => void;
}

export const useStore = create<State>()((set) => ({
  notes: [],
  forceFilesyetemUpdate: 0,
  forceNotesViewUpdate: 0,
  setForceFilesystemUpdate: () =>
    set((state) => ({
      ...state,
      forceFilesyetemUpdate: state.forceFilesyetemUpdate + 1,
    })),
  setForceNotesViewUpdate: () =>
    set((state) => ({
      ...state,
      forceNotesViewUpdate: state.forceNotesViewUpdate + 1,
    })),
  currentActiveFilePath: `${localStorage.getItem("LatestActiveFile")}`,
  currentActiveFolderPath: `${localStorage.getItem("LatestActiveFolder")}`,
  setNotes: (newNotes) => set((state) => ({ ...state, notes: newNotes })),
  setCurrentActiveFilePath: (path: string | null) =>
    set((state) => {
      if (!path) return state;
      return { ...state, currentActiveFilePath: path };
    }),
  setCurrentActiveFolderPath: (path: string | null) =>
    set((state) => {
      if (!path) return state;
      return { ...state, currentActiveFolderPath: path };
    }),
}));
