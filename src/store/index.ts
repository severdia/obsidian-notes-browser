import { TFile } from "obsidian";
import { create } from "zustand";

interface State {
	notes: TFile[];
	currentActiveFile: string;
	forceFilesyetemUpdate: number;
	setNotes: (notes: TFile[]) => void;
	setCurrentActiveFile: (file: TFile | null) => void;
	setForceFilesystemUpdate: () => void;
}

export const useStore = create<State>()((set) => ({
	notes: [],
	forceFilesyetemUpdate: 0,
	setForceFilesystemUpdate: () =>
		set((state) => ({
			...state,
			forceFilesyetemUpdate: state.forceFilesyetemUpdate + 1,
		})),
	currentActiveFile: `${localStorage.getItem("LatestActiveFile")}`,
	setNotes: (newNotes) => set((state) => ({ ...state, notes: newNotes })),
	setCurrentActiveFile: (file: TFile | null) =>
		set((state) => {
			if (!file) return state;
			return { ...state, currentActiveFile: file.path };
		}),
}));
