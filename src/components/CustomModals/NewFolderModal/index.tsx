import { useLocalApp } from "hooks";
import { Modal, Notice } from "obsidian";
import { useEffect, useRef } from "react";
import { useStore } from "store";

interface CustomModalProps {
  modal: Modal;
}

export function NewFolderModal({ modal }: Readonly<CustomModalProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const app = useLocalApp();

  const currentActiveFolderPath = useStore(
    (state) => state.currentActiveFolderPath
  );

  useEffect(() => {
    modal.setTitle("Create folder");
    inputRef.current?.focus();
  });

  const createFolder = () => {
    if (!app || !inputRef.current) {
      modal.close();
      return;
    }

    if (currentActiveFolderPath === "") {
      new Notice(
        "You should select the parent folder first before creating the new one"
      );
      modal.close();
      return;
    }

    app.vault
      .createFolder(`${currentActiveFolderPath}/${inputRef.current.value}`)
      .catch((e) => {
        new Notice(e);
      });

    modal.close();
  };

  const cancel = () => modal.close();

  return (
    <>
      <input
        ref={inputRef}
        className="onb-w-full onb-p-2 onb-border-solid onb-border onb-rounded-md onb-border-gray-400"
        placeholder="folder name .."
        defaultValue="Untitled"
      />
      <div className="modal-button-container">
        <button className="mod-cta" onClick={createFolder}>
          create
        </button>
        <button className="mod-cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
