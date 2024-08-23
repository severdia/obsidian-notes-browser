import { TreeView } from "components/TreeView";
import { NotesView } from "components/NotesView";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export function PluginUI() {
	return (
		<PanelGroup
			direction="horizontal"
			className="ayy-fixed ayy-w-full !ayy-top-0 !ayy-left-0 ayy-h-full"
		>
			<Panel defaultSize={40} minSize={40}>
				<TreeView />
			</Panel>
			<PanelResizeHandle className="ayy-w-[var(--divider-width)] ayy-bg-[var(--divider-color)]" />
			<Panel defaultSize={30} minSize={20}>
				<NotesView />
			</Panel>
		</PanelGroup>
	);
}
