import { useCallback, useEffect, useState } from "react";
import { useApp } from "hooks";
import { TFolder, TAbstractFile, TFile } from "obsidian";
import { useStore } from "store";
import { sortFilesAlphabetically, toBoolean } from "utils";
import { Folder } from "components/Folder";
import { IoAddCircleOutline } from "react-icons/io5";
import { BaseModal } from "components/CustomModals/BaseModal";
import { NewFolderModal } from "components/CustomModals";

export function TreeView() {
  const app = useApp();
  const [root, setRoot] = useState<TAbstractFile | null>();
  const forceFilesystemUpdate = useStore(
    (state) => state.forceFilesyetemUpdate
  );

  const handleNewFolder = () => {
    if (!app) return;
    const newFolderModal = new BaseModal(app, () => (
      <NewFolderModal modal={newFolderModal} />
    ));
    newFolderModal.open();
  };

  useEffect(() => {
    if (!app) return;
    const rootFolder = app.vault.getAbstractFileByPath(
      app.vault.getRoot().path
    );

    if (app && rootFolder) {
      rootFolder.name = app.vault.getName();
    }

    setRoot(rootFolder);
  }, [forceFilesystemUpdate]);

  return (
    <div className="onb-flex onb-flex-col onb-h-full onb-w-full onb-p-2">
      <div className="onb-flex onb-flex-grow onb-overflow-scroll onb-flex-col onb-h-full onb-w-full onb-p-2">
        {root instanceof TFolder && <FilesystemItem folder={root} />}
      </div>
      <div
        onClick={handleNewFolder}
        className="onb-w-full onb-flex onb-flex-row onb-items-center onb-gap-1 onb-py-1 onb-px-2 onb-rounded-sm hover:onb-bg-gray-200 hover:onb-cursor-pointer"
      >
        <IoAddCircleOutline />
        <span>New Folder</span>
      </div>
    </div>
  );
}

export function FilesystemItem({
  folder,
  isRoot = false,
}: Readonly<{ folder: TFolder; isRoot?: boolean }>) {
  const setNotes = useStore((state) => state.setNotes);
  const setCurrentActiveFolderPath = useStore(
    (state) => state.setCurrentActiveFolderPath
  );

  const app = useApp();
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

  // Only render if it's not the root or if it's open
  if (isRoot) {
    return (
      <ul className="onb-pl-6 onb-list-none">
        {sortFilesAlphabetically(folder.children).map(
          (folder) =>
            folder instanceof TFolder && (
              <FilesystemItem folder={folder} key={folder.name} />
            )
        )}
      </ul>
    );
  }

  return (
    <li key={folder.path} className="onb-list-none onb-w-full">
      <Folder
        folder={folder}
        onClickChevron={() => showSubfolders(folder)}
        onClickFolder={() => showNotesUnderFolder(folder)}
        isOpen={isOpen}
      />

      {isOpen && (
        <ul className="onb-pl-6 onb-list-none onb-m-0">
          {sortFilesAlphabetically(folder.children).map(
            (folder) =>
              folder instanceof TFolder && (
                <FilesystemItem folder={folder} key={folder.path} />
              )
          )}
        </ul>
      )}
    </li>
  );
}
