import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { PluginUI } from "components/PluginView";
import { ObsidianConfigContext, PluginContext } from "utils";
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
    this.containerEl.setAttribute("id", "obsidian-note-browser")
    this.root = createRoot(this.containerEl.children[1]);
    const obsidianDefaultConfig = await this.plugin.app.vault.adapter.read(
      `${this.plugin.app.vault.configDir}/app.json`
    );

    this.root.render(
      <ObsidianConfigContext.Provider value={JSON.parse(obsidianDefaultConfig)}>
        <PluginContext.Provider value={this.plugin}>
          <PluginUI />
        </PluginContext.Provider>
      </ObsidianConfigContext.Provider>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}
