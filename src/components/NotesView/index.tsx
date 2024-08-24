import { useStore } from "store";
import { Note } from "components/Note";

export function NotesView() {
	const files = useStore((state) => state.notes);

	return (
		<div className="ayy-flex ayy-flex-col ayy-bg-white ayy-h-full ayy-w-full ayy-p-2 ayy-flex-grow ayy-gap-2">
			{files.map((file) => (
				<Note key={file.path} file={file} />
			))}
		</div>
	);
}
