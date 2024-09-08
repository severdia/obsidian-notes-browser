import { useObsidianConfig } from "hooks";
import { App, TAbstractFile, TFile, TFolder } from "obsidian";

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

export const extractImageLink = async (app: App, text: string) => {
  const localImageRegexPattern = /!\[\[(.*?)\]\]/;
  const firstLocalExtractedImage = RegExp(localImageRegexPattern).exec(text);

  const remoteImageRegexPattern = /!\[\]\((https?:\/\/[^)]+)\)/;
  const firstRemoteExtractedImage = RegExp(remoteImageRegexPattern).exec(text);

  if (!firstLocalExtractedImage && !firstRemoteExtractedImage) {
    return null;
  }

  if (
    (!firstLocalExtractedImage && firstRemoteExtractedImage) ||
    (firstLocalExtractedImage &&
      firstRemoteExtractedImage &&
      firstLocalExtractedImage.index > firstRemoteExtractedImage.index)
  ) {
    return firstRemoteExtractedImage[1];
  }

  if (
    (firstLocalExtractedImage && !firstRemoteExtractedImage) ||
    (firstLocalExtractedImage &&
      firstRemoteExtractedImage &&
      firstLocalExtractedImage.index < firstRemoteExtractedImage.index)
  ) {
    const imageFilename = firstLocalExtractedImage[1];

    try {
      const path = await app.fileManager.getAvailablePathForAttachment("");
      const attachmentFolder = path.slice(0, -2); // remove trailing slashes
      const imageAbstractFile = app.vault.getAbstractFileByPath(
        `${attachmentFolder}/${imageFilename}`
      );
      if (imageAbstractFile instanceof TFile) {
        return app.vault.getResourcePath(imageAbstractFile);
      }
    } catch (error) {
      console.error("Error extracting local image:", error);
    }
  }

  return null;
};
