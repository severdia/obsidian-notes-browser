import { useEffect, useState } from "react";
import {
	IoChevronDown,
	IoChevronForward,
	IoFolderOutline,
} from "react-icons/io5";
import { useApp } from "../hooks/useApp";
import { TFolder, TAbstractFile } from "obsidian";

export function TreeView() {
	const app = useApp();
	const [folders, setFolders] = useState<TAbstractFile[]>([]);

	useEffect(() => {
		if (!app) return;
		const allFolders = app.vault.getAbstractFileByPath(
			app.vault.getRoot().path
		);
		allFolders instanceof TFolder && setFolders(allFolders.children);
	}, [app]);

	return (
		<div className="ayy-flex ayy-flex-col ayy-w-full ayy-min-w-[200px] ayy-p-3">
			<Folder data={folders} />
		</div>
	);
}

export function Folder(props: Readonly<{ data: TAbstractFile[] }>) {
	const [isOpen, setIsOpen] = useState(false);
	const app = useApp();
	const handleClick = (folder: TFolder) => {
		setIsOpen(!isOpen);
		if (!app) return;
		console.log(folder.name);
		console.log(app.vault.getFolderByPath(folder.path)?.children);
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
