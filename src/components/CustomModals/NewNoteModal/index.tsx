import { useLocalApp } from "hooks";
import { Modal, Notice } from "obsidian";
import { useEffect, useRef } from "react";

interface CustomModalProps {
  modal: Modal;
  folderPath: string;
}

export function NewNoteModal({
  modal,
  folderPath,
}: Readonly<CustomModalProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const app = useLocalApp();

  useEffect(() => {
    modal.setTitle("New note");
    inputRef.current?.focus();
  });

  const createNote = () => {
    if (!app || !inputRef.current) {
      modal.close();
      return;
    }

    app.vault
      .createBinary(
        `${folderPath}/${inputRef.current.value}.md`,
        new ArrayBuffer(0)
      )
      .catch((e) => new Notice(e));

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
        <button className="mod-cta" onClick={createNote}>
          Create
        </button>
        <button className="mod-cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
