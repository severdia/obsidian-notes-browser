import { TreeView } from "components/TreeView";
import { NotesView } from "components/NotesView";

export function PluginUI() {
	return (
		<div className="ayy-flex flex-grow relative ayy-h-full ayy-flex-row">
			<div className="ayy-flex ayy-flex-col ayy-w-[286px] ayy-p-3 ayy-box-border">
				<TreeView></TreeView>
			</div>
			<NotesView></NotesView>
		</div>
	);
}
