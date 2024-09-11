import { Folder } from "components/Folder";
import { useObsidianConfig, usePlugin } from "hooks";
import { TFolder, TFile } from "obsidian";
import { useState, useCallback } from "react";
import { toBoolean, sortFilesAlphabetically } from "utils";
import { useStore } from "store";

interface FilesystemProps {
  folder: TFolder;
}

export function Filesystem(props: Readonly<FilesystemProps>) {
  const { folder } = props;
  const setNotes = useStore((state) => state.setNotes);
  const attachementFolderName = (
    useObsidianConfig().attachmentFolderPath as string
  ).replace("./", "");
  const setCurrentActiveFolderPath = useStore(
    (state) => state.setCurrentActiveFolderPath
  );

  const { app, settings } = usePlugin();
  const [isOpen, setIsOpen] = useState<boolean>(
    toBoolean(localStorage.getItem(folder.path))
  );

  const showNotesUnderFolder = useCallback((folder: TFolder) => {
    if (!app) return;
    const filesUnderFolder = app.vault.getFolderByPath(folder.path)?.children;
    if (!filesUnderFolder) return;
    setCurrentActiveFolderPath(folder.path);
    setNotes(
      filesUnderFolder.filter((abstractFile) => abstractFile instanceof TFile)
    );
  }, []);

  const showSubfolders = useCallback(
    (folder: TFolder) => {
      localStorage.setItem(folder.path, `${!isOpen}`);
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  const isAttachmentFolder = folder.name === attachementFolderName;

  if (settings.hideAttachmentFolder && isAttachmentFolder) {
    return null;
  }
 
  return (
    <li key={folder.path} className="onb-list-none onb-w-full custom-scrollbar">
      <Folder
        folder={folder}
        onClickChevron={() => showSubfolders(folder)}
        onClickFolder={() => showNotesUnderFolder(folder)}
        isOpen={isOpen}
      />

      {isOpen && (
        <ul className="onb-pl-2 onb-list-none onb-m-0">
          {sortFilesAlphabetically(folder.children).map((child) => {
            if (child instanceof TFolder) {
              if (
                settings.hideAttachmentFolder ||
                child.name !== attachementFolderName
              ) {
                return <Filesystem folder={child} key={child.path} />;
              }
            }
          })}
        </ul>
      )}
    </li>
  );
}
