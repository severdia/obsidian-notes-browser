import { TFile, TFolder } from "obsidian";
import { create } from "zustand";

interface State {
  notes: TFile[];
  currentActiveFile: string;
  currentActiveFolder: string;
  forceFilesyetemUpdate: number;
  forceNotesViewUpdate: number;
  setNotes: (notes: TFile[]) => void;
  setCurrentActiveFile: (file: TFile | null) => void;
  setCurrentActiveFolder: (folder: TFolder | null) => void;
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
  currentActiveFile: `${localStorage.getItem("LatestActiveFile")}`,
  currentActiveFolder: `${localStorage.getItem("LatestActiveFolder")}`,
  setNotes: (newNotes) => set((state) => ({ ...state, notes: newNotes })),
  setCurrentActiveFile: (file: TFile | null) =>
    set((state) => {
      if (!file) return state;
      return { ...state, currentActiveFile: file.path };
    }),
  setCurrentActiveFolder: (folder: TFolder | null) =>
    set((state) => {
      if (!folder) return state;
      return { ...state, currentActiveFile: folder.path };
    }),
}));
