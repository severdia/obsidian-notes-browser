import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { SingleView } from "./SingleView";
import { StrictMode } from "react";

export const VIEW_TYPE = "obsidian-notes-browser";

export class PluginView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<SingleView />,
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
