import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { PluginUI } from "components/PluginView";
import { AppContext } from "utils";

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
    return "Apple Notes Explorer";
  }

  getIcon() {
    return "folder";
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(
      <AppContext.Provider value={this.app}>
        <PluginUI />
      </AppContext.Provider>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}
