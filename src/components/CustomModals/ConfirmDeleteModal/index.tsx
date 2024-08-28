import { useApp } from "hooks";
import { Modal } from "obsidian";
import { useEffect } from "react";
import { useStore } from "store";

interface CustomModalProps {
  modal: Modal;
  abstractFilePath: string;
  abstractFileName: string;
}

export function ConfirmDeleteModal(props: Readonly<CustomModalProps>) {
  const app = useApp();
  const setForceNotesViewUpdate = useStore(
    (state) => state.setForceNotesViewUpdate
  );

  useEffect(() => {
    props.modal.setTitle("Delete file");
  });

  const deleteFile = () => {
    if (!app) {
      props.modal.close();
      return;
    }
    const fileToDelete = app.vault.getAbstractFileByPath(
      props.abstractFilePath
    );
    if (!fileToDelete) return;
    app.vault.trash(fileToDelete, true);
    setForceNotesViewUpdate();
    props.modal.close();
  };

  const cancel = () => props.modal.close();

  return (
    <>
      <p>Are you sure you want to delete “${props.abstractFileName}”?</p>
      <p>It will be moved to your system trash.</p>
      <div className="modal-button-container">
        <button className="mod-warning" onClick={deleteFile}>
          Delete
        </button>
        <button className="mod-cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
