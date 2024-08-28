import { CustomModal } from "components/CustomModal";
import { BaseModal } from "components/CustomModal/BaseModal";
import { useApp, useDragHandlers } from "hooks";
import { TFolder, Notice, Menu, Modal } from "obsidian";
import { useState, DragEventHandler } from "react";
import { createRoot } from "react-dom/client";
import Dropzone from "react-dropzone";
import {
  IoChevronForward,
  IoChevronDown,
  IoFolderOutline,
} from "react-icons/io5";

import { useStore } from "store";
import { isContainFolders, getNumberOfNotes, AppContext } from "utils";

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
    ? "ayy-bg-[#6AA0F9] !ayy-text-white"
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
      <CustomModal
        modal={confirmation}
        abstractFileName={props.folder.name}
        abstractFilePath={props.folder.path}
      />
    ));

    confirmation.open();
  };

  const handleFolderContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!app) return;
    const fileMenu = new Menu();
    const fileToTrigger = app.vault.getAbstractFileByPath(props.folder.path);

    if (!fileToTrigger) return;

    fileMenu.addItem((menuItem) => {
      menuItem.setTitle("Delete");
      menuItem.setIcon("trash");
      menuItem.onClick(handleDelete);
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
    <Dropzone
      onDragOver={() => setIsDropping(true)}
      onDragEnter={() => {
        setIsDropping(true);
      }}
      onDropAccepted={() => {
        setIsDropping(false);
      }}
      onDropRejected={() => {
        setIsDropping(false);
      }}
      onDragLeave={() => {
        setIsDropping(false);
      }}
      onDrop={handleOnDropFiles}
      noClick={true}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={`ayy-w-full ${activeBackgroundColor} ayy-flex ayy-rounded-sm ayy-items-center ayy-justify-between ayy-pr-2 ${
            !isActive && isDropping ? "ayy-bg-[#c7c6ca]" : ""
          }`}
          onDragOver={() => setIsDropping(true)}
          onDragEnter={() => {
            setIsDropping(true);
          }}
          onDragLeave={() => {
            setIsDropping(false);
          }}
          onDrop={onDrop}
          data-path={props.folder.path}
          draggable
          onDragStart={onDragStart}
          onContextMenu={handleFolderContextMenu}
        >
          <div
            {...getRootProps()}
            className={`ayy-w-full ayy-flex ayy-rounded-sm ayy-items-center ayy-justify-between ${
              !isActive && isDropping ? "ayy-bg-[#c7c6ca]" : ""
            }`}
          >
            <input {...getInputProps()} />
            <span
              className={`ayy-flex ayy-items-center ayy-py-1 ${
                containsFolders ? "" : "ayy-ml-6"
              }`}
            >
              {props.folder.children && containsFolders && (
                <div
                  className="ayy-size-6 ayy-min-w-6 ayy-flex ayy-items-center ayy-justify-center ayy-min-h-6"
                  onClick={props.onClickChevron}
                >
                  {props.folder.children &&
                    (!props.isOpen ? (
                      <IoChevronForward
                        className={`ayy-size-5 ayy-min-w-5 ayy-min-h-5  ${
                          isActive ? "ayy-text-white" : "ayy-text-[#616064]"
                        } `}
                      />
                    ) : (
                      <IoChevronDown
                        className={`ayy-size-5 ayy-min-w-5 ayy-min-h-5  ${
                          isActive ? "ayy-text-white" : "ayy-text-[#616064]"
                        } `}
                      />
                    ))}
                </div>
              )}
            </span>

            <div
              className="ayy-w-full ayy-py-1 ayy-flex ayy-rounded-sm ayy-items-center ayy-justify-between"
              onClick={props.onClickFolder}
            >
              <span className="ayy-flex ayy-gap-1.5 ayy-flex-row ayy-flex-nowrap ayy-items-center">
                <IoFolderOutline
                  className={`ayy-size-6 ayy-min-w-6 ayy-min-h-6  ${
                    isActive ? "ayy-text-white" : "ayy-text-sky-500"
                  } `}
                />
                <span className="ayy-truncate ayy-text-nowrap">
                  {props.folder.name}
                </span>
              </span>
              {props.folder.children?.length !== 0 && (
                <div>{getNumberOfNotes(props.folder.children)}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
