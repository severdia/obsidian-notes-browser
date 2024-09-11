import {
  BaseModal,
  ConfirmDeleteModal,
  RenameModal,
} from "components/CustomModals";
import { useDragHandlers, usePlugin } from "hooks";
import { Menu, TFile } from "obsidian";
import { memo, useCallback, useEffect, useState } from "react";
import { useStore } from "store";
import { extractImageLink, getLastModified } from "utils";
import { NoteListView } from "./NoteListView";
import { NoteGridView } from "./NoteGridView";

interface CustomTFile extends TFile {
  deleted?: boolean;
  content?: string;
}

interface NoteProps {
  file: CustomTFile;
}

export const Note = memo(({ file }: NoteProps) => {
  const currentActiveFilePath = useStore(
    (state) => state.currentActiveFilePath
  );
  const { forceNotesViewUpdate, notesViewType } = useStore((state) => ({
    forceNotesViewUpdate: state.forceNotesViewUpdate,
    notesViewType: state.notesViewType,
  }));

  const { app, settings } = usePlugin();
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("loading");
  const { onDragStart } = useDragHandlers(file);
  const isSelected = currentActiveFilePath == file.path;
  const backgroundColorClass = isSelected
    ? "onb-bg-[--onb-note-background-active] onb-rounded-md onb-z-10"
    : "onb-bg-white";

  const seperatorClasses = isSelected
    ? "" 
    : "onb-bg-[--onb-divider-background] -onb-mt-[--onb-divider-height]";

  useEffect(() => {
    if (!app) return;

    const updateContent = (content: string) => {
      setDescription(content.slice(0, Math.min(content.length, 400)));
      const imageLink = extractImageLink(content);
      if (imageLink) {
        const firstImageLinkpathDest = app.metadataCache.getFirstLinkpathDest(
          imageLink,
          file.path
        );
        if (firstImageLinkpathDest) {
          const resourceImagePath = app.vault.getResourcePath(
            firstImageLinkpathDest
          );
          setImageLink(resourceImagePath);
          return;
        }
      }
      setImageLink(imageLink);
    };

    const getContent = async () => {
      if (file.deleted) {
        const content = file.content ?? "";
        updateContent(content);
        return;
      }

      const content = await app.vault.cachedRead(file);
      updateContent(content);
    };

    getContent();
  }, [app, file, forceNotesViewUpdate]);

  const openFile = useCallback(() => {
    if (!app) return;
    const fileToOpen = app.vault.getAbstractFileByPath(file.path);
    if (!fileToOpen) return;

    const leaf = app.workspace.getLeaf(false);
    app.workspace.setActiveLeaf(leaf, {
      focus: true,
    });

    leaf.openFile(fileToOpen as TFile, { eState: { focus: true } });
  }, []);

  const handleDelete = useCallback(() => {
    if (!app) return;
    const confirmation = new BaseModal(app, () => (
      <ConfirmDeleteModal
        modal={confirmation}
        abstractFileName={file.name}
        abstractFilePath={file.path}
      />
    ));

    confirmation.open();
  }, []);

  const handleRename = useCallback(() => {
    if (!app) return;
    const renameFileModal = new BaseModal(app, () => (
      <RenameModal modal={renameFileModal} file={file} />
    ));

    renameFileModal.open();
  }, []);

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
    <>
      {notesViewType === "LIST" && (
        <div
          className={`onb-size-full onb-flex onb-flex-col onb-justify-between ${backgroundColorClass}`}
        >
          <div className="onb-w-full onb-px-[--onb-divider-padding-x] onb-h-fit">
            <div
              className={`onb-w-full ${seperatorClasses} onb-h-[--onb-divider-height]`}
            />
          </div>
          <NoteListView
            className={`onb-p-3 ${backgroundColorClass} onb-h-full onb-select-none onb-flex onb-flex-row onb-items-center`}
            onClick={openFile}
            draggable={!settings.isDraggingFilesAndFoldersdisabled}
            onDragStart={onDragStart}
            data-path={file.path}
            onContextMenu={handleContextMenu}
            title={file.basename}
            description={description}
            imageLink={imageLink}
            lastModificationTimeOrDate={getLastModified(file)}
          />
        </div>
      )}

      {notesViewType === "GRID" && (
        <NoteGridView
          className={`onb-p-3 ${backgroundColorClass} onb-w-full onb-max-w-[--onb-note-grid-width] onb-h-[--onb-note-grid-height] onb-select-none onb-rounded onb-flex onb-flex-col onb-items-center onb-gap-3`}
          onClick={openFile}
          draggable={!settings.isDraggingFilesAndFoldersdisabled}
          onDragStart={onDragStart}
          data-path={file.path}
          onContextMenu={handleContextMenu}
          title={file.basename}
          description={description}
          imageLink={imageLink}
          lastModificationTimeOrDate={getLastModified(file)}
        />
      )}
    </>
  );
});
