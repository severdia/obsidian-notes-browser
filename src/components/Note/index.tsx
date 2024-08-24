import { useApp } from "hooks";
import { TFile } from "obsidian";
import { useStore } from "store";

interface NoteProps {
	title: string;
	description: string;
	time: string;
	image?: string;
	onClick: () => void;
	file: TFile;
}

export function Note(props: NoteProps) {
	const currentActiveFile = useStore((state) => state.currentActiveFile);
	const backgroundColorClass =
		currentActiveFile == props.file.path
			? "ayy-bg-gray-200"
			: "ayy-bg-white";

	return (
		<div
			className={`ayy-p-3 ${backgroundColorClass} ayy-rounded ayy-flex ayy-flex-row"`}
			onClick={props.onClick}
		>
			<div className="ayy-flex-grow ayy-flex-col ayy-truncate">
				<div className="ayy-text-[16px] ayy-font-bold">
					{props.title}
				</div>
				<div className="ayy-flex ayy-flex-row ayy-gap-2 ayy-w-full">
					<div className="ayy-text-[14px] ayy-font-semibold ayy-text-nowrap">
						{props.time}
					</div>
					<div className="ayy-text-gray-400 ayy-truncate ayy-text-[14px]">
						{props.description}
					</div>
				</div>
			</div>
			{props.image && (
				<img
					src={props.image}
					alt=""
					className="ayy-min-h-9 ayy-min-w-9 ayy-border ayy-border-gray-300 ayy-rounded"
				/>
			)}
		</div>
	);
}
