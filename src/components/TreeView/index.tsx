import { useEffect, useState } from "react";
import {
	IoChevronDown,
	IoChevronForward,
	IoFolderOutline,
} from "react-icons/io5";
import { useApp } from "hooks";
import { TFolder, TAbstractFile, TFile } from "obsidian";
import { useStore } from "store";

export function TreeView() {
	const app = useApp();
	const setNotes = useStore((state) => state.setNotes);
	const [folders, setFolders] = useState<TAbstractFile[]>([]);
	const showRootNotes = () => {
		const rootFolder = app?.vault.getRoot();
		if (!rootFolder) return;
		const notes = rootFolder.children.filter(
			(abstractFile) => abstractFile instanceof TFile
		);
		setNotes(notes);
	};

	useEffect(() => {
		if (!app) return;
		const allFolders = app.vault.getAbstractFileByPath(
			app.vault.getRoot().path
		);
		allFolders instanceof TFolder && setFolders(allFolders.children);
	}, [app]);

	return (
		<div
			className="ayy-flex ayy-flex-col ayy-h-full ayy-w-full ayy-bg-blue-200 ayy-min-w-[200px] ayy-p-3"
			// onClick={showRootNotes}
		>
			<Folder data={folders} />
		</div>
	);
}

export function Folder(props: Readonly<{ data: TAbstractFile[] }>) {
	const [isOpen, setIsOpen] = useState(false);
	const setNotes = useStore((state) => state.setNotes);

	const app = useApp();
	const handleClick = (folder: TFolder) => {
		setIsOpen(!isOpen);
		if (!app) return;
		const filesUnderFolder = app.vault.getFolderByPath(
			folder.path
		)?.children;
		if (!filesUnderFolder) return;

		const notes: TFile[] = [];

		for (const abstractFile of filesUnderFolder) {
			if (abstractFile instanceof TFile) {
				notes.push(abstractFile);
			}
		}

		setNotes(notes);
	};

	return (
		<>
			{props.data.map(
				(folder) =>
					folder instanceof TFolder && (
						<div key={folder.path}>
							<div
								className="ayy-flex ayy-flex-row ayy-w-full ayy-justify-between "
								onClick={() => handleClick(folder)}
							>
								<div className="ayy-flex ayy-flex-row ayy-gap-2">
									<div className="ayy-flex ayy-flex-row ayy-items-center ayy-gap-2">
										{isOpen ? (
											<IoChevronDown />
										) : (
											<IoChevronForward />
										)}
										<IoFolderOutline className="ayy-text-blue-600" />
									</div>
									<div>{folder.name}</div>
								</div>
								{folder.children?.length !== 0 && (
									<div>{folder.children.length}</div>
								)}
							</div>

							{isOpen && (
								<div className="ayy-flex ayy-flex-col ayy-pl-4 ayy-w-full">
									<Folder
										data={folder.children as TFolder[]}
									/>
								</div>
							)}
						</div>
					)
			)}
		</>
	);
}
