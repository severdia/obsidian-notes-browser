import { useObsidianConfig } from "hooks";
import { TAbstractFile, TFile, TFolder } from "obsidian";

export { PluginContext } from "./PluginContext";
export { AppContext } from "./AppContext";
export { ObsidianConfigContext } from "./ObsidianConfigContext";

export function isContainFolders(folder: TFolder) {
  const attachementFolderName = (
    useObsidianConfig().attachmentFolderPath as string
  ).replace("./", "");

  return folder.children.some(
    (abstractFile) =>
      abstractFile instanceof TFolder &&
      abstractFile.name !== attachementFolderName
  );
}

export function sortFilesAlphabetically(
  files?: TAbstractFile[]
): TAbstractFile[] {
  if (!files) return [];
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export function getNumberOfNotes(files: TAbstractFile[]) {
  return files.filter((file) => file instanceof TFile && file.extension == "md")
    .length;
}

export function toBoolean(value: string | null) {
  return value === "true";
}

export function getLastModified(note: TFile) {
  const lastModified = new Date(note.stat.mtime);
  const now = new Date();

  const isToday = lastModified.toDateString() === now.toDateString();

  if (isToday) {
    return lastModified.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return lastModified.toLocaleDateString();
  }
}
