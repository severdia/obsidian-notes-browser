import { useStore } from "store";
import NotesBrowser from "./main";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
  plugin: NotesBrowser;

  constructor(app: App, plugin: NotesBrowser) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Enable dragging folders & files")
      .addToggle((toggleComp) => {
        toggleComp.setValue(
          this.plugin.settings.isDraggingFilesAndFoldersEnabled
        );
        toggleComp.onChange(this.updateSettings);
      });

    new Setting(containerEl)
      .setName("Show attachements folder")
      .addToggle((toggleComp) => {
        toggleComp.setValue(this.plugin.settings.showAttachmentFolder);
        toggleComp.onChange(this.updateSettings);
      });
  }

  updateSettings = async (value: boolean) => {
    this.plugin.settings.isDraggingFilesAndFoldersEnabled = value;
    await this.plugin.saveSettings();
    new Notice("Obsidian Notes Browser settings are updated");
    useStore.getState().setForceFilesystemUpdate();
    useStore.getState().setForceNotesViewUpdate();
  };
}
