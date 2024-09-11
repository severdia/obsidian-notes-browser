import { useLocalApp } from "hooks";
import { Modal, Notice, TFolder } from "obsidian";
import { useEffect, useRef } from "react";

interface CustomModalProps {
  modal: Modal;
  file: TFolder;
}

export function NewFolderModal({ modal, file }: Readonly<CustomModalProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const app = useLocalApp();

  useEffect(() => {
    modal.setTitle("New folder");
    inputRef.current?.focus();
  });

  const createFolder = () => {
    if (!app || !inputRef.current) {
      modal.close();
      return;
    }

    app.vault
      .createFolder(`${file.path}/${inputRef.current.value}`)
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
      />
      <div className="modal-button-container">
        <button className="mod-cta" onClick={createFolder}>
          Create
        </button>
        <button className="mod-cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
