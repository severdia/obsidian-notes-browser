import { useCallback, useEffect, useState } from "react";
import { useApp, usePlugin } from "hooks";
import { TFolder, TAbstractFile, TFile } from "obsidian";
import { useStore } from "store";
import { sortFilesAlphabetically, toBoolean } from "utils";
import { Folder } from "components/Folder";
import { IoAddCircleOutline } from "react-icons/io5";
import { BaseModal } from "components/CustomModals/BaseModal";
import { NewFolderModal } from "components/CustomModals";

export function TreeView() {
  const app = useApp();
  const [root, setRoot] = useState<TAbstractFile | null>(null);
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
    <div className="onb-flex onb-flex-col onb-h-full onb-w-full onb-py-2 onb-pl-2">
      <div className="onb-flex onb-flex-grow onb-overflow-scroll onb-flex-col onb-h-full onb-w-full onb-p-2">
        {root instanceof TFolder && <FilesystemItem folder={root} />}
      </div>
      <div
        onClick={handleNewFolder}
        className="onb-w-[calc(100%-8px)] onb-flex onb-flex-row onb-items-center onb-gap-1 onb-py-1 onb-px-2 onb-rounded-sm hover:onb-bg-gray-200 hover:onb-cursor-pointer"
      >
        <IoAddCircleOutline />
        <span>New Folder</span>
      </div>
    </div>
  );
}

interface FilesystemItemProps {
  folder: TFolder;
}

export function FilesystemItem(props: Readonly<FilesystemItemProps>) {
  const { folder } = props;
  const setNotes = useStore((state) => state.setNotes);
  const setCurrentActiveFolderPath = useStore(
    (state) => state.setCurrentActiveFolderPath
  );

  const { app, settings } = usePlugin();
  const [isOpen, setIsOpen] = useState<boolean>(
    toBoolean(localStorage.getItem(folder.path))
  );
  const [attachmentFolder, setAttachmentFolder] = useState<string | null>(null);

  useEffect(() => {
    if (!app) return;
    app.fileManager
      .getAvailablePathForAttachment("")
      .then((path) => setAttachmentFolder(path.slice(0, -2)))
      .catch(() => setAttachmentFolder(null));
  }, [app]);

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

  const isAttachmentFolder = folder.path === attachmentFolder;

  if (!settings.showAttachmentFolder && isAttachmentFolder) {
    return null;
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
        <ul className="onb-pl-2 onb-list-none onb-m-0">
          {sortFilesAlphabetically(folder.children).map((child) => {
            if (child instanceof TFolder) {
              if (
                settings.showAttachmentFolder ||
                child.path !== attachmentFolder
              ) {
                return <FilesystemItem folder={child} key={child.path} />;
              }
            }
          })}
        </ul>
      )}
    </li>
  );
}
