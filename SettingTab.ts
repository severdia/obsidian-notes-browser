import { useStore } from "store";
import NotesBrowser from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

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
        toggleComp.onChange(async (value: boolean) => {
          this.plugin.settings.isDraggingFilesAndFoldersEnabled = value;
          this.updateSettings();
        });
      });

    new Setting(containerEl)
      .setName("Show attachments folder")
      .addToggle((toggleComp) => {
        toggleComp.setValue(this.plugin.settings.showAttachmentFolder);
        toggleComp.onChange(async (value: boolean) => {
          this.plugin.settings.showAttachmentFolder = value;
          this.updateSettings();
        });
      });
  }

  updateSettings = async () => {
    await this.plugin.saveSettings();
    useStore.getState().setForceFilesystemUpdate();
    useStore.getState().setForceNotesViewUpdate();
  };
}
