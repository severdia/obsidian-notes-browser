import { useCallback, useEffect, useState } from "react";
import { useApp } from "hooks";
import { TFolder, TAbstractFile, TFile } from "obsidian";
import { useStore } from "store";
import { sortFilesAlphabetically, toBoolean } from "utils";
import { Folder } from "components/Folder";

export function TreeView() {
  const app = useApp();
  const [root, setRoot] = useState<TAbstractFile | null>();
  const forceFilesystemUpdate = useStore(
    (state) => state.forceFilesyetemUpdate
  );

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
    <div
      className="ayy-flex ayy-flex-col ayy-h-full ayy-w-full ayy-p-2"
      // onClick={showRootNotes}
    >
      {root instanceof TFolder && <FilesystemItem node={root} />}
    </div>
  );
}

export function FilesystemItem({
  node,
  isRoot = false,
}: Readonly<{ node: TFolder; isRoot?: boolean }>) {
  const setNotes = useStore((state) => state.setNotes);

  const app = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(
    toBoolean(localStorage.getItem(node.path))
  );

  const showNotesUnderFolder = useCallback((folder: TFolder) => {
    if (!app) return;
    const filesUnderFolder = app.vault.getFolderByPath(folder.path)?.children;
    if (!filesUnderFolder) return;

    setNotes(
      filesUnderFolder.filter((abstractFile) => abstractFile instanceof TFile)
    );
  }, []);

  // Only render if it's not the root or if it's open
  if (isRoot) {
    return (
      <ul className="ayy-pl-6 ayy-list-none">
        {sortFilesAlphabetically(node.children).map(
          (node) =>
            node instanceof TFolder && (
              <FilesystemItem node={node} key={node.name} />
            )
        )}
      </ul>
    );
  }

  return (
    <li key={node.path} className="ayy-list-none ayy-w-full">
      <Folder
        node={node}
        onClickChevron={() => setIsOpen(!isOpen)}
        onClickFolder={() => showNotesUnderFolder(node)}
        isOpen={isOpen}
      />

      {isOpen && (
        <ul className="ayy-pl-6 ayy-list-none ayy-m-0">
          {sortFilesAlphabetically(node.children).map(
            (node) =>
              node instanceof TFolder && (
                <FilesystemItem node={node} key={node.path} />
              )
          )}
        </ul>
      )}
    </li>
  );
}
