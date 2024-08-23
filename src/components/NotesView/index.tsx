import { useStore } from "store";
import { Note } from "components/Note";
import { TFile } from "obsidian";
import { useApp } from "hooks";
import { useEffect, useState } from "react";
import { describe } from "node:test";

function getLastModified(note: TFile) {
	const lastModified = new Date(note.stat.mtime);
	const now = new Date();

	const isToday = lastModified.toDateString() === now.toDateString();

	if (isToday) {
		return lastModified.toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} else {
		return lastModified.toLocaleDateString();
	}
}

interface NoteType {
	title: string;
	description: string;
	time: string;
	file: TFile;
}

export function NotesView() {
	const [notes, setNotes] = useState<NoteType[]>([]);
	const files = useStore((state) => state.notes);
	const app = useApp();

	useEffect(() => {
		async function fetchNotes() {
			const data = [];
			for (const file of files) {
				if (!app) return [];
				const content = await app.vault.cachedRead(file);
				data.push({
					title: file.name,
					description: content.slice(0, Math.max(content.length, 400)),
					time: getLastModified(file),
					file: file,
				});
			}

			setNotes(data);
		}

		fetchNotes();
	}, [files]);

	const openFile = (file: TFile) => {
		if (!app) return;
		const fileToOpen = app.vault.getAbstractFileByPath(file.path);
		if (!fileToOpen) return;
		const leaf = app.workspace.getLeaf("tab");

		app.workspace.setActiveLeaf(leaf, {
			focus: true,
		});

		leaf.openFile(fileToOpen as TFile, { eState: { focus: true } });
	};

	return (
		<div className="ayy-flex ayy-flex-col ayy-h-full ayy-w-full ayy-p-2 ayy-flex-grow ayy-gap-2">
			{notes.map((note) => (
				<Note
					key={note.file.path}
					title={note.title}
					description={note.description}
					time={note.time}
					onClick={() => openFile(note.file)}
				/>
			))}
		</div>
	);
}
