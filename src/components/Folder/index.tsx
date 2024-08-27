import { useApp, useDragHandlers } from "hooks";
import { TFolder, Notice } from "obsidian";
import { useState, DragEventHandler } from "react";
import Dropzone from "react-dropzone";
import {
  IoChevronForward,
  IoChevronDown,
  IoFolderOutline,
} from "react-icons/io5";
import { isContainFolders, getNumberOfNotes } from "utils";

interface FolderProps {
  isOpen: boolean;
  onClickChevron: () => void;
  onClickFolder: () => void;
  node: TFolder;
}

export function Folder(props: Readonly<FolderProps>) {
  const [isDropping, setIsDropping] = useState(false);
  const containsFolders = isContainFolders(props.node);
  const app = useApp();
  const { onDragStart } = useDragHandlers(props.node);

  const handleOnDropFiles = (droppabaleFiles: File[]) => {
    if (!app) return;
    droppabaleFiles.map(async (file) => {
      file.arrayBuffer().then((content) => {
        app.vault.adapter.writeBinary(
          `${props.node.path}/${file.name}`,
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
            `${props.node.path}/${abstractFilePath.name}`
          )
          .catch((e) => new Notice(`${e}`));
        return;

      case "folder":
        if (!props.node.path.startsWith(abstractFilePath.path)) {
          app.vault
            .rename(
              abstractFilePath,
              `${props.node.path}/${abstractFilePath.name}`
            )
            .catch((e) => new Notice(`${e}`));
          return;
        }
        new Notice("You can't move a parent folder under its children");
        return;
    }
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
          className={`ayy-w-full ayy-flex ayy-rounded-sm ayy-items-center ayy-justify-between ayy-pr-2 ${
            isDropping ? "ayy-bg-[#c7c6ca]" : ""
          }`}
          onDragOver={() => setIsDropping(true)}
          onDragEnter={() => {
            setIsDropping(true);
          }}
          onDragLeave={() => {
            setIsDropping(false);
          }}
          onDrop={onDrop}
          data-path={props.node.path}
          draggable
          onDragStart={onDragStart}
        >
          <div
            {...getRootProps()}
            className={`ayy-w-full ayy-flex ayy-rounded-sm ayy-pr-2 ayy-items-center ayy-justify-between ${
              isDropping ? "ayy-bg-[#c7c6ca]" : ""
            }`}
          >
            <input {...getInputProps()} />
            <span
              className={`ayy-flex ayy-items-center ayy-py-1 ${
                containsFolders ? "" : "ayy-ml-6"
              }`}
            >
              {props.node.children && (
                <span className="size-fit ayy-flex ayy-flex-row ayy-flex-nowrap ayy-items-center ">
                  {containsFolders && (
                    <div
                      className="ayy-size-6 ayy-min-w-6 ayy-flex ayy-items-center ayy-justify-center ayy-min-h-6"
                      onClick={props.onClickChevron}
                    >
                      {props.node.children &&
                        (!props.isOpen ? (
                          <IoChevronForward className=" ayy-size-5 ayy-min-w-5 ayy-min-h-5 " />
                        ) : (
                          <IoChevronDown className=" ayy-size-5 ayy-min-w-5 ayy-min-h-5 " />
                        ))}
                    </div>
                  )}
                </span>
              )}

              <span
                className="ayy-flex ayy-gap-1.5 ayy-flex-row ayy-flex-nowrap ayy-items-center"
                onClick={props.onClickFolder}
              >
                <IoFolderOutline
                  className={`ayy-size-6 ayy-min-w-6 ayy-min-h-6  ayy-text-sky-500 `}
                />
                <span className="ayy-truncate ayy-text-nowrap">
                  {props.node.name}
                </span>
              </span>
            </span>
            {props.node.children?.length !== 0 && (
              <div>{getNumberOfNotes(props.node.children)}</div>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
}
