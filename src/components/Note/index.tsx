import {
  BaseModal,
  ConfirmDeleteModal,
  RenameModal,
} from "components/CustomModals";
import { useApp, useDragHandlers } from "hooks";
import { Menu, TFile } from "obsidian";
import { memo, useEffect, useState } from "react";
import { useStore } from "store";
import { getLastModified } from "utils";

interface NoteProps {
  file: TFile;
}

export const Note = memo(({ file }: NoteProps) => {
  const currentActiveFilePath = useStore(
    (state) => state.currentActiveFilePath
  );
  const forceNotesViewUpdate = useStore((state) => state.forceNotesViewUpdate);
  const app = useApp();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("loading");
  const { onDragStart } = useDragHandlers(file);
  const backgroundColorClass =
    currentActiveFilePath == file.path ? "onb-bg-gray-200" : "onb-bg-white";

  useEffect(() => {
    if (!app) return;
    const content = app.vault.cachedRead(file);
    content.then((text) => {
      setDescription(text.slice(0, Math.max(text.length, 400)));
    });
  }, [forceNotesViewUpdate]);

  const openFile = () => {
    if (!app) return;
    const fileToOpen = app.vault.getAbstractFileByPath(file.path);
    if (!fileToOpen) return;
    const leaf = app.workspace.getLeaf("tab");

    app.workspace.setActiveLeaf(leaf, {
      focus: true,
    });

    leaf.openFile(fileToOpen as TFile, { eState: { focus: true } });
  };

  const handleDelete = () => {
    if (!app) return;
    const confirmation = new BaseModal(app, () => (
      <ConfirmDeleteModal
        modal={confirmation}
        abstractFileName={file.name}
        abstractFilePath={file.path}
      />
    ));

    confirmation.open();
  };

  const handleRename = () => {
    if (!app) return;
    const renameFileModal = new BaseModal(app, () => (
      <RenameModal modal={renameFileModal} file={file} />
    ));

    renameFileModal.open();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!app) return;
    const fileMenu = new Menu();
    const fileToTrigger = app.vault.getAbstractFileByPath(file.path);

    if (!fileToTrigger) return;

    fileMenu.addItem((menuItem) => {
      menuItem.setTitle("Delete");
      menuItem.setIcon("trash");
      menuItem.onClick(handleDelete);
    });

    fileMenu.addItem((menuItem) => {
      menuItem.setTitle("Rename");
      menuItem.setIcon("pencil");
      menuItem.onClick(handleRename);
    });

    app.workspace.trigger(
      "file-menu",
      fileMenu,
      fileToTrigger,
      "file-explorer"
    );

    fileMenu.showAtPosition({ x: e.pageX, y: e.pageY });
  };

  return (
    <div
      className={`onb-p-3 ${backgroundColorClass} onb-rounded onb-flex onb-flex-row"`}
      onClick={openFile}
      draggable
      onDragStart={onDragStart}
      data-path={file.path}
      onContextMenu={handleContextMenu}
    >
      <div className="onb-flex-grow onb-flex-col onb-truncate">
        <div className="onb-text-[16px] onb-font-bold">{file.basename}</div>
        <div className="onb-flex onb-flex-row onb-gap-2 onb-w-full">
          <div className="onb-text-[14px] onb-font-semibold onb-text-nowrap">
            {getLastModified(file)}
          </div>
          <div className="onb-text-gray-400 onb-truncate onb-text-[14px]">
            {description}
          </div>
        </div>
      </div>
      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="onb-min-h-9 onb-min-w-9 onb-border onb-border-gray-300 onb-rounded"
        />
      )}
    </div>
  );
});
