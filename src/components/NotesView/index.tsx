import { useStore } from "store";
import { Note } from "components/Note";
import { TFile } from "obsidian";

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

export function NotesView() {
	const notes = useStore((state) => state.notes);

	return (
		<div className="ayy-flex ayy-flex-col ayy-h-full ayy-w-[256px] ayy-flex-grow ayy-gap-2">
			{notes.map((note) => (
				<Note
					title={note.name}
					description="lorem ipsmim mlppe sqq kllemme deess eaaz cccdd dffqq vffd"
					time={getLastModified(note)}
				/>
			))}
		</div>
	);
}
