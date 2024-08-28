import { useApp } from "hooks";
import { Modal, TFile } from "obsidian";
import { useEffect, useRef } from "react";
import { useStore } from "store";

interface CustomModalProps {
  modal: Modal;
  file: TFile;
}

export function RenameModal({ modal, file }: Readonly<CustomModalProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const app = useApp();
  const setForceNotesViewUpdate = useStore(
    (state) => state.setForceNotesViewUpdate
  );

  useEffect(() => {
    modal.setTitle("Rename file");
  });

  const renameFile = () => {
    if (!app || !inputRef.current) {
      modal.close();
      return;
    }
    app.fileManager.renameFile(
      file,
      `${file.parent?.path}/${inputRef.current.value}.${file.extension}`
    );

    setForceNotesViewUpdate();
    modal.close();
  };

  const cancel = () => modal.close();

  return (
    <>
      <input
        ref={inputRef}
        className="ayy-w-full ayy-p-2 ayy-border-solid ayy-border ayy-rounded-md ayy-border-gray-400"
        placeholder="name .."
      />
      <div className="modal-button-container">
        <button className="mod-warning" onClick={renameFile}>
          Save
        </button>
        <button className="mod-cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
