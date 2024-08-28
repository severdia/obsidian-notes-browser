import { ConfirmDeleteModal, RenameModal } from "components/CustomModals";
import { BaseModal } from "components/CustomModals/BaseModal";
import { useApp, useDragHandlers } from "hooks";
import { TFolder, Notice, Menu } from "obsidian";
import { useState, DragEventHandler } from "react";
import Dropzone from "react-dropzone";

import {
  IoChevronForward,
  IoChevronDown,
  IoFolderOutline,
} from "react-icons/io5";

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
          className={`onb-w-full ${activeBackgroundColor} onb-flex onb-rounded-sm onb-items-center onb-justify-between onb-pr-2 ${
            !isActive && isDropping ? "onb-bg-[#c7c6ca]" : ""
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
                  {props.folder.children &&
                    (!props.isOpen ? (
                      <IoChevronForward
                        className={`onb-size-5 onb-min-w-5 onb-min-h-5  ${
                          isActive ? "onb-text-white" : "onb-text-[#616064]"
                        } `}
                      />
                    ) : (
                      <IoChevronDown
                        className={`onb-size-5 onb-min-w-5 onb-min-h-5  ${
                          isActive ? "onb-text-white" : "onb-text-[#616064]"
                        } `}
                      />
                    ))}
                </div>
              )}
            </span>

            <div
              className="onb-w-full onb-py-1 onb-flex onb-rounded-sm onb-items-center onb-justify-between"
              onClick={props.onClickFolder}
            >
              <span className="onb-flex onb-gap-1.5 onb-flex-row onb-flex-nowrap onb-items-center">
                <IoFolderOutline
                  className={`onb-size-6 onb-min-w-6 onb-min-h-6  ${
                    isActive ? "onb-text-white" : "onb-text-sky-500"
                  } `}
                />
                <span className="onb-truncate onb-text-nowrap">
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
