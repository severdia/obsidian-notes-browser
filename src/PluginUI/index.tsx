import { TreeView } from "../TreeView";
import { NotesView } from "../NotesView";

export function PluginUI() {
	return (
		<div className="ayy-flex flex-grow relative ayy-h-full ayy-flex-row">
			<div className="ayy-flex ayy-flex-col ayy-w-full ayy-min-w-[200px] ayy-p-3 ayy-box-border">
				<TreeView></TreeView>
			</div>
			<NotesView></NotesView>
		</div>
	);
}
