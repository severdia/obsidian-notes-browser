import { IoFolderOutline } from "react-icons/io5";

interface FolderData {
	root: string;
	subFolders?: FolderData[];
}

interface FolderProps {
	data: FolderData;
}

const DATA_EXAMPLE: FolderData = {
	root: "Movies",
	subFolders: [
		{
			root: "Test 1",
			subFolders: [
				{
					root: "Movies",
					subFolders: [
						{
							root: "Test 1",
							subFolders: [],
						},
					],
				},
			],
		},
		{
			root: "Test 2",
			subFolders: [
				{
					root: "Test 1",
					subFolders: [],
				},
			],
		},
		{
			root: "Test 3",
			subFolders: [
				{
					root: "Test 1",
					subFolders: [],
				},
			],
		},
	],
};

export function TreeView() {
	return <Folder data={DATA_EXAMPLE} />;
}

export function Folder(props: FolderProps) {
	return (
		<div>
			<div className="ayy-flex ayy-flex-row ayy-w-full ayy-justify-between">
				<div className="ayy-flex ayy-flex-row ayy-gap-2">
					{props.data.subFolders?.length !== 0 && (
						<IoFolderOutline className="ayy-text-blue-300" />
					)}

					<div>{props.data.root}</div>
				</div>

				{props.data.subFolders?.length !== 0 && (
					<div>{props.data.subFolders?.length}</div>
				)}
			</div>
			<div className="ayy-flex ayy-flex-col ayy-pl-4 ayy-w-full">
				{props.data.subFolders?.map((folder, i) => (
					<Folder data={folder} key={i} />
				))}
			</div>
		</div>
	);
}
