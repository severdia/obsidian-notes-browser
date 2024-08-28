import { CustomModal } from "components/CustomModal";
import { BaseModal } from "components/CustomModal/BaseModal";
import { useApp, useDragHandlers } from "hooks";
import { Menu, TAbstractFile, TFile, TFolder } from "obsidian";
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
  const app = useApp();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("loading");
  const { onDragStart } = useDragHandlers(file);
  const backgroundColorClass =
    currentActiveFilePath == file.path ? "ayy-bg-gray-200" : "ayy-bg-white";

  useEffect(() => {
    if (!app) return;
    const content = app.vault.cachedRead(file);
    content.then((text) => {
      setDescription(text.slice(0, Math.max(text.length, 400)));
    });
  }, []);

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
      <CustomModal
        modal={confirmation}
        abstractFileName={file.name}
        abstractFilePath={file.path}
      />
    ));

    confirmation.open();
  };

  const handleRename = () => {
    if (!app) return;
    app.fileManager.renameFile(file, `${file.parent?.path}/Hello world.${file.extension}`);
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
      className={`ayy-p-3 ${backgroundColorClass} ayy-rounded ayy-flex ayy-flex-row"`}
      onClick={openFile}
      draggable
      onDragStart={onDragStart}
      data-path={file.path}
      onContextMenu={handleContextMenu}
    >
      <div className="ayy-flex-grow ayy-flex-col ayy-truncate">
        <div className="ayy-text-[16px] ayy-font-bold">{file.basename}</div>
        <div className="ayy-flex ayy-flex-row ayy-gap-2 ayy-w-full">
          <div className="ayy-text-[14px] ayy-font-semibold ayy-text-nowrap">
            {getLastModified(file)}
          </div>
          <div className="ayy-text-gray-400 ayy-truncate ayy-text-[14px]">
            {description}
          </div>
        </div>
      </div>
      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="ayy-min-h-9 ayy-min-w-9 ayy-border ayy-border-gray-300 ayy-rounded"
        />
      )}
    </div>
  );
});
