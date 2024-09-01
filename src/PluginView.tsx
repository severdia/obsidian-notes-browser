import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { PluginUI } from "components/PluginView";
import { PluginContext } from "utils";
import NotesBrowser from "main";

export const VIEW_TYPE = "obsidian-notes-browser";

export class PluginView extends ItemView {
  root: Root | null = null;
  plugin: NotesBrowser;

  constructor(leaf: WorkspaceLeaf, plugin: NotesBrowser) {
    super(leaf);
    this.plugin = plugin;
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
      <PluginContext.Provider value={this.plugin}>
        <PluginUI />
      </PluginContext.Provider>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}
