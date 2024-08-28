import { Notice, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { PluginView, VIEW_TYPE } from "./src/PluginView";
import { useStore } from "store";

interface NotesBrowserSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: NotesBrowserSettings = {
  mySetting: "default",
};

export default class NotesBrowser extends Plugin {
  settings: NotesBrowserSettings;

  async onload() {
    await this.loadSettings();

    const ribbonIconEl = this.addRibbonIcon(
      "dice",
      "Sample Plugin",
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new Notice("This is a notice!");
      }
    );
    ribbonIconEl.addClass("my-plugin-ribbon-class");

    this.registerView(VIEW_TYPE, (leaf) => new PluginView(leaf));

    this.addRibbonIcon("dice", "Activate view", () => {
      this.activateView();
    });

    this.app.workspace.on("active-leaf-change", () => {
      const currentOpenFile = this.app.workspace.getActiveFile();
      if (!currentOpenFile) return;
      useStore.getState().setCurrentActiveFilePath(currentOpenFile.path);
    });

    this.app.vault.on("create", () => {
      useStore.getState().setForceFilesystemUpdate();
    });

    this.app.vault.on("delete", () => {
      this.updateNotesView();
    });

    this.app.vault.on("rename", () => {
      this.updateNotesView();
    });

    this.app.vault.on("modify", (file) => {
      console.log("modification");
    });
  }

  onunload() {}

  updateNotesView() {
    const { currentActiveFolderPath, setForceFilesystemUpdate, setNotes } =
      useStore.getState();

    setForceFilesystemUpdate();

    const filesUnderFolder = this.app.vault.getFolderByPath(
      currentActiveFolderPath
    )?.children;
    if (!filesUnderFolder) return;

    setNotes(
      filesUnderFolder.filter((abstractFile) => abstractFile instanceof TFile)
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      await leaf?.setViewState({ type: VIEW_TYPE, active: true });
    }

    leaf && workspace.revealLeaf(leaf);
  }
}
