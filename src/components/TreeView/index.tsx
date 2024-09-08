import { useEffect, useState } from "react";
import { useApp } from "hooks";
import { TFolder, TAbstractFile } from "obsidian";
import { useStore } from "store";
import { IoAddCircleOutline } from "react-icons/io5";
import { BaseModal } from "components/CustomModals/BaseModal";
import { NewFolderModal } from "components/CustomModals";
import { TrashFolder } from "./TrashFolder";
import { Filesystem } from "./Filesystem";

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
    <div className="onb-flex onb-flex-col onb-bg-[--onb-filesystem-background-color] onb-overflow-x-hidden custom-scrollbar onb-h-full onb-w-full onb-pt-2 onb-pl-2">
      <div className="onb-px-2 onb-overflow-scroll onb-w-full onb-flex-grow">
        <div className="onb-flex onb-h-fit onb-flex-col onb-w-full">
          {root instanceof TFolder && <Filesystem folder={root} />}
        </div>
        <TrashFolder />
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
