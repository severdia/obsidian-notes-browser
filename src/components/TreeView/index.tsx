import { DragEventHandler, useCallback, useEffect, useState } from "react";
import {
	IoChevronDown,
	IoChevronForward,
	IoFolderOutline,
} from "react-icons/io5";
import { useApp } from "hooks";
import { TFolder, TAbstractFile, TFile, Notice } from "obsidian";
import { useStore } from "store";
import Dropzone from "react-dropzone";

export function TreeView() {
	const app = useApp();
	const [root, setRoot] = useState<TAbstractFile | null>();
	const forceFilesystemUpdate = useStore(
		(state) => state.forceFilesyetemUpdate
	);

	useEffect(() => {
		console.log("update file system");
		const rootFolder = app?.vault.getAbstractFileByPath(
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

function getNumberOfNotes(files: TAbstractFile[]) {
	return files.filter((file) => file instanceof TFile).length;
}

function toBoolean(value: string | null) {
	return value === "true";
}

function Folder(props: Readonly<FolderProps>) {
	const [isDropping, setIsDropping] = useState(false);
	const containsFolders = isContainFolders(props.node);
	const app = useApp();

	const handleOnDropFiles = (droppabaleFiles: File[]) => {
		if (!app) return;
		droppabaleFiles.map(async (file) => {
			file.arrayBuffer().then((content) => {
				app.vault.adapter.writeBinary(
					`${props.node.path}/${file.name}`,
					content
				);
			});
		});
	};

	const onDropNote: DragEventHandler<HTMLDivElement> = (dropEvent) => {
		if (!app) return;
		const data = dropEvent.dataTransfer.getData("application/json");
		if (data !== "") {
			const dataJson = JSON.parse(data);

			if (dataJson["filePath"]) {
				const filePath = dataJson.filePath;
				const file = app.vault.getAbstractFileByPath(filePath);
				if (file) {
					app.vault
						.rename(file, `${props.node.path}/${file.name}`)
						.catch((e) => new Notice(`${e}`));
				}
			}
		}

		dropEvent.dataTransfer.clearData();
		setIsDropping(false);
	};

	return (
		<Dropzone
			onDragOver={() => setIsDropping(true)}
			onDragEnter={() => {
				setIsDropping(true);
			}}
			onDropAccepted={() => {
				setIsDropping(false);
			}}
			onDropRejected={() => {
				setIsDropping(false);
			}}
			onDragLeave={() => {
				setIsDropping(false);
			}}
			onDrop={handleOnDropFiles}
		>
			{({ getRootProps, getInputProps }) => (
				<div
					className={`ayy-w-full ayy-flex ayy-rounded-sm ayy-items-center ayy-justify-between ayy-pr-2 ${
						isDropping ? "ayy-bg-[#c7c6ca]" : ""
					}`}
					onDragOver={() => setIsDropping(true)}
					onDragEnter={() => {
						setIsDropping(true);
					}}
					onDragLeave={() => {
						setIsDropping(false);
					}}
					onDrop={onDropNote}
					data-path={props.node.path}
					draggable
				>
					<div
						{...getRootProps()}
						className={`ayy-w-full ayy-flex ayy-rounded-sm ayy-pr-2 ayy-items-center ayy-justify-between ${
							isDropping ? "ayy-bg-[#c7c6ca]" : ""
						}`}
					>
						<input {...getInputProps()} />
						<span
							className={`ayy-flex ayy-items-center ayy-gap-1.5 ayy-py-1 ${
								containsFolders ? "" : "ayy-ml-6"
							}`}
							onClick={props.onClick}
						>
							{props.node.children && (
								<span className="size-fit ayy-flex ayy-flex-row ayy-flex-nowrap ayy-items-center">
									{containsFolders && (
										<div className="ayy-size-6 ayy-min-w-6 ayy-flex ayy-items-center ayy-justify-center ayy-min-h-6">
											{props.node.children &&
												(!props.isOpen ? (
													<IoChevronForward className=" ayy-size-5 ayy-min-w-5 ayy-min-h-5 " />
												) : (
													<IoChevronDown className=" ayy-size-5 ayy-min-w-5 ayy-min-h-5 " />
												))}
										</div>
									)}

									<IoFolderOutline
										className={`ayy-size-6 ayy-min-w-6 ayy-min-h-6  ayy-text-sky-500 `}
									/>
								</span>
							)}

							<span className="ayy-truncate ayy-text-nowrap">
								{props.node.name}
							</span>
						</span>
						{props.node.children?.length !== 0 && (
							<div>{getNumberOfNotes(props.node.children)}</div>
						)}
					</div>
				</div>
			)}
		</Dropzone>
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

	const handleClick = useCallback(
		(folder: TFolder) => {
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
		},
		[isOpen]
	);

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
