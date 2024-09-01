import {
  ConfirmDeleteModal,
  NewNoteModal,
  RenameModal,
} from "components/CustomModals";
import { BaseModal } from "components/CustomModals/BaseModal";
import { IcChevron } from "components/Icons/IcChevron";
import { IcFolderOutline } from "components/Icons/IcFolderOutline";
import { useApp, useDragHandlers } from "hooks";
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
  const app = useApp();
  const { onDragStart } = useDragHandlers(props.folder);

  const currentActiveFolderPath = useStore(
    (state) => state.currentActiveFolderPath
  );

  const isActive = currentActiveFolderPath === props.folder.path;
  const activeBackgroundColor = isActive
    ? "onb-bg-[#6AA0F9] !onb-text-white"
    : "";

  const handleOnDropFiles = (droppabaleFiles: File[]) => {
    if (!app) return;
    droppabaleFiles.map(async (file) => {
      file.arrayBuffer().then((content) => {
        app.vault.adapter.writeBinary(
          `${props.folder.path}/${file.name}`,
          content
        );
      });
    });
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (dropEvent) => {
    setIsDropping(false);
    if (!app) return;
    const data = dropEvent.dataTransfer.getData("application/json");
    dropEvent.dataTransfer.clearData();

    if (data === "") return;

    const { type, path } = JSON.parse(data);
    const abstractFilePath = app.vault.getAbstractFileByPath(path);
    if (!abstractFilePath) return;

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

  const IcChevronBase = ({ direction }: { direction: "forward" | "down" }) => {
    const style = direction == "forward" ? {} : { transform: "rotate(90deg)" };
    return (
      <IcChevron
        style={style}
        className={`onb-size-fit onb-min-w-fit onb-min-h-fit ${
          isActive ? "onb-text-white" : "onb-text-[#616064]"
        } `}
      />
    );
  };

  return (
    <Dropzone
      onDragOver={enableDroppingEffect}
      onDragEnter={enableDroppingEffect}
      onDropAccepted={disableDroppingEffect}
      onDropRejected={disableDroppingEffect}
      onDragLeave={disableDroppingEffect}
      onDrop={handleOnDropFiles}
      noClick={true}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={`onb-w-full ${activeBackgroundColor} onb-flex onb-rounded-sm onb-items-center onb-justify-between onb-pr-2 ${
            !isActive && isDropping ? "onb-bg-[#c7c6ca]" : ""
          }`}
          onDragOver={enableDroppingEffect}
          onDragEnter={enableDroppingEffect}
          onDragLeave={disableDroppingEffect}
          onDrop={onDrop}
          data-path={props.folder.path}
          draggable
          onDragStart={onDragStart}
          onContextMenu={handleFolderContextMenu}
        >
          <div
            {...getRootProps()}
            className={`onb-w-full onb-flex onb-rounded-sm onb-items-center onb-justify-between ${
              !isActive && isDropping ? "onb-bg-[#c7c6ca]" : ""
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
                    <IcChevronBase
                      direction={!props.isOpen ? "forward" : "down"}
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
                <IcFolderOutline
                  className={`onb-size-fit onb-min-w-fit onb-min-h-fit  ${
                    isActive ? "onb-text-white" : "onb-text-sky-500"
                  } `}
                />
                <div className="onb-truncate onb-text-[14px]">
                  {props.folder.name}
                </div>
              </div>
              <div className="onb-size-fit min-h-fit onb-min-w-fit">
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
