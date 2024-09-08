import {
  ConfirmDeleteModal,
  NewNoteModal,
  RenameModal,
} from "components/CustomModals";
import { BaseModal } from "components/CustomModals/BaseModal";
import { Chevron } from "components/Icons/Chevron";
import { FolderOutline } from "components/Icons/FolderOutline";
import { useDragHandlers, usePlugin } from "hooks";
import { TFolder, Notice, Menu } from "obsidian";
import { useState, DragEventHandler } from "react";
import Dropzone from "react-dropzone";

import { useStore } from "store";
import { isContainFolders, getNumberOfNotes } from "utils";

interface FolderProps {
  isOpen: boolean;
  onClickChevron: () => void;
  onClickFolder: () => void;
  folder: TFolder;
}

export function Folder(props: Readonly<FolderProps>) {
  const [isDropping, setIsDropping] = useState(false);
  const containsFolders = isContainFolders(props.folder);
  const { app, settings } = usePlugin();
  const { onDragStart } = useDragHandlers(props.folder);

  const currentActiveFolderPath = useStore(
    (state) => state.currentActiveFolderPath
  );

  const isActive = currentActiveFolderPath === props.folder.path;
  const activeBackgroundColor = isActive
    ? "onb-bg-[--onb-folder-background-active] !onb-text-white"
    : "";

  const handleOnDropFiles = (droppabaleFiles: File[]) => {
    if (!app) return;
    droppabaleFiles.map((file) => {
      file.arrayBuffer().then((content) => {
        app.vault.adapter.writeBinary(
          `${props.folder.path}/${file.name}`,
          content
        );
      });
    });
  };

  const restoreFileOrFolder = async (path: string) => {
    const slashSpliter = path.split("/");
    const filename = slashSpliter.last();
    await app.vault.adapter.rename(path, `${props.folder.path}/${filename}`);
    useStore.getState().setForceNotesViewUpdate();
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (dropEvent) => {
    setIsDropping(false);
    if (!app) return;
    const data = dropEvent.dataTransfer.getData("application/json");
    dropEvent.dataTransfer.clearData();

    if (data === "") return;

    const { type, path } = JSON.parse(data);
    const abstractFilePath = app.vault.getAbstractFileByPath(path);
    if (!abstractFilePath) {
      if (currentActiveFolderPath === ".trash") {
        restoreFileOrFolder(path);
      }
      return;
    }
    switch (type) {
      case "file":
        app.vault
          .rename(
            abstractFilePath,
            `${props.folder.path}/${abstractFilePath.name}`
          )
          .catch((e) => new Notice(`${e}`));
        return;

      case "folder":
        if (!props.folder.path.startsWith(abstractFilePath.path)) {
          app.vault
            .rename(
              abstractFilePath,
              `${props.folder.path}/${abstractFilePath.name}`
            )
            .catch((e) => new Notice(`${e}`));
          return;
        }
        new Notice("You can't move a parent folder under its children");
        return;
    }
  };

  const handleDelete = () => {
    if (!app) return;
    const confirmation = new BaseModal(app, () => (
      <ConfirmDeleteModal
        modal={confirmation}
        abstractFileName={props.folder.name}
        abstractFilePath={props.folder.path}
      />
    ));
    confirmation.open();
  };

  const handleRename = () => {
    if (!app) return;
    const renameFileModal = new BaseModal(app, () => (
      <RenameModal modal={renameFileModal} file={props.folder} />
    ));

    renameFileModal.open();
  };

  const handleNewNote = () => {
    if (!app) return;
    const newNoteModal = new BaseModal(app, () => (
      <NewNoteModal modal={newNoteModal} folderPath={props.folder.path} />
    ));
    newNoteModal.open();
  };

  const disableDroppingEffect = () => setIsDropping(false);
  const enableDroppingEffect = () => setIsDropping(true);

  const handleFolderContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!app) return;
    const fileToTrigger = app.vault.getAbstractFileByPath(props.folder.path);
    if (!fileToTrigger) return;

    const folderMenu = new Menu();

    folderMenu.addItem((menuItem) => {
      menuItem.setTitle("New note");
      menuItem.setIcon("edit");
      menuItem.onClick(handleNewNote);
    });

    folderMenu.addItem((menuItem) => {
      menuItem.setTitle("Rename");
      menuItem.setIcon("pencil");
      menuItem.onClick(handleRename);
    });

    folderMenu.addItem((menuItem) => {
      menuItem.setTitle("Delete");
      menuItem.setIcon("trash");
      menuItem.onClick(handleDelete);
    });

    app.workspace.trigger(
      "file-menu",
      folderMenu,
      fileToTrigger,
      "file-explorer"
    );

    folderMenu.showAtPosition({ x: e.pageX, y: e.pageY });
  };

  const folderStyleClasses = isActive
    ? "onb-text-white"
    : "onb-text-[--onb-folder-icon-color]";

  return (
    <Dropzone
      onDragOver={enableDroppingEffect}
      onDragEnter={enableDroppingEffect}
      onDropAccepted={disableDroppingEffect}
      onDropRejected={disableDroppingEffect}
      onDragLeave={disableDroppingEffect}
      onDrop={handleOnDropFiles}
      noClick={true}
      noDrag={settings.isDraggingFilesAndFoldersdisabled}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={`onb-w-full ${activeBackgroundColor} onb-flex onb-rounded-sm onb-items-center onb-justify-between onb-pr-2 ${
            !isActive && isDropping
              ? "onb-bg-[--onb-folder-background-hover]"
              : ""
          }`}
          onDragOver={enableDroppingEffect}
          onDragEnter={enableDroppingEffect}
          onDragLeave={disableDroppingEffect}
          onDrop={onDrop}
          data-path={props.folder.path}
          draggable={!settings.isDraggingFilesAndFoldersdisabled}
          onDragStart={onDragStart}
          onContextMenu={handleFolderContextMenu}
        >
          <div
            {...getRootProps()}
            className={`onb-w-full onb-flex onb-rounded-sm onb-items-center onb-justify-between ${
              !isActive && isDropping
                ? "onb-bg-[--onb-folder-background-hover]"
                : ""
            }`}
          >
            <input {...getInputProps()} />
            <span
              className={`onb-flex onb-items-center onb-py-1 ${
                containsFolders ? "" : "onb-ml-6"
              }`}
            >
              {props.folder.children && containsFolders && (
                <div
                  className="onb-size-6 onb-min-w-6 onb-flex onb-items-center onb-justify-center onb-min-h-6"
                  onClick={props.onClickChevron}
                >
                  {props.folder.children && (
                    <Chevron
                      direction={!props.isOpen ? "forward" : "down"}
                      isActive={isActive}
                    />
                  )}
                </div>
              )}
            </span>

            <div
              className="onb-flex-grow onb-py-1 onb-truncate onb-flex onb-rounded-sm onb-items-center"
              onClick={props.onClickFolder}
            >
              <div className="onb-flex onb-flex-grow onb-truncate onb-gap-1.5 onb-flex-row onb-flex-nowrap onb-items-center">
                <FolderOutline
                  className={`onb-size-fit ${folderStyleClasses} onb-min-w-fit onb-min-h-fit`}
                />
                <div className="onb-truncate onb-text-[length:--onb-folder-text-size]">
                  {props.folder.name}
                </div>
              </div>
              <div className="onb-size-fit onb-text-[color:--onb-folder-text-color] onb-text-[length:--onb-folder-text-size] min-h-fit onb-min-w-fit">
                {props.folder.children?.length !== 0 && (
                  <span>{getNumberOfNotes(props.folder.children)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
