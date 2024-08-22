import { TFile } from "obsidian";
import { create } from "zustand";

interface State {
	notes: TFile[];
	setNotes: (notes: TFile[]) => void;
}

export const useStore = create<State>()((set) => ({
	notes: [],
	setNotes: (newNotes) => set((state) => ({ notes: newNotes })),
}));
