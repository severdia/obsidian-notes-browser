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
	const rootFolder = app?.vault.getAbstractFileByPath(
		app.vault.getRoot().path
	);

	if (app && rootFolder) {
		rootFolder.name = app.vault.getName();
	}

	return (
		<div
			className="ayy-flex ayy-flex-col ayy-h-full ayy-w-full"
			// onClick={showRootNotes}
		>
			{rootFolder instanceof TFolder && (
				<FilesystemItem node={rootFolder} />
			)}
		</div>
	);
}

function isContainFolders(folder: TFolder) {
	return folder.children.some(
		(abstractFile) => abstractFile instanceof TFolder
	);
}

function sortFilesAlphabetically(files?: TAbstractFile[]): TAbstractFile[] {
	if (!files) return [];
	return files.sort((a, b) => a.name.localeCompare(b.name));
}

interface FolderProps {
	isOpen: boolean;
	onClick: () => void;
	node: TFolder;
}

function Folder(props: FolderProps) {
	return (
		<div className="ayy-w-full ayy-flex ayy-items-center ayy-justify-between">
			<span
				className="ayy-flex ayy-items-center ayy-gap-1.5 ayy-py-1"
				onClick={props.onClick}
			>
				<span className="size-fit ayy-flex ayy-flex-row ayy-flex-nowrap ayy-items-center">
					<div className="ayy-size-6 ayy-min-w-6 ayy-min-h-6">
						{props.node.children &&
							props.node.children.length > 0 &&
							(!props.isOpen ? (
								<IoChevronForward className=" ayy-size-6 ayy-min-w-6 ayy-min-h-6 " />
							) : (
								<IoChevronDown className=" ayy-size-6 ayy-min-w-6 ayy-min-h-6 " />
							))}
					</div>

					{props.node.children && (
						<IoFolderOutline
							className={`ayy-size-6 ayy-min-w-6 ayy-min-h-6  ayy-text-sky-500 ${
								props.node.children.length === 0
									? "ayy-ml-6"
									: ""
							}`}
						/>
					)}
				</span>

				<span className="ayy-truncate ayy-text-nowrap">
					{props.node.name}
				</span>
			</span>
			{props.node.children?.length !== 0 && (
				<div>{props.node.children.length}</div>
			)}
		</div>
	);
}

export function FilesystemItem({
	node,
	isRoot = false,
}: Readonly<{ node: TFolder; isRoot?: boolean }>) {
	const setNotes = useStore((state) => state.setNotes);

	const app = useApp();
	let [isOpen, setIsOpen] = useState<boolean>(
		Boolean(localStorage.getItem(node.path))
	);

	const handleClick = (folder: TFolder) => {
		localStorage.setItem(node.path, `${!isOpen}`);
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
				onClick={() => handleClick(node)}
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
