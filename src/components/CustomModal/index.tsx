import { Modal } from "obsidian";

interface CustomModalProps {
	modal: Modal;
	fileName: string;
}

export function CustomModal(props: CustomModalProps) {
    
	return (
		<>
			<p>Are you sure you want to delete “${props.fileName}”?</p>
			<p>It will be moved to your system trash.</p>
			<div className="modal-button-container">
				<button className="mod-warning">Delete</button>
				<button className="mod-cancel">Cancel</button>
			</div>
		</>
	);
}
