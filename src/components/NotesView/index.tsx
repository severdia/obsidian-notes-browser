import { useStore } from "store";
import { Note } from "components/Note";
import { IoGridOutline, IoTrashOutline } from "react-icons/io5";
import { ReactNode, useEffect } from "react";
import { FaListUl } from "react-icons/fa";

const NotesViewHeader = (props: React.ComponentProps<"div">) => {
	const Tab = ({ children }: { children: ReactNode }) => (
		<div className="ayy-h-fit ayy-px-2 ayy-flex ayy-items-center ayy-justify-center">
			{children}
		</div>
	);
	return (
		<div
			className="ayy-flex ayy-w-full ayy-flex-row ayy-border-0 ayy-items-center ayy-py-2 ayy-border-b-[var(--divider-color)] ayy-border-b-[1.5px] ayy-justify-between ayy-border-solid ayy-px-2 ayy-text-[var(--icon-color)]"
			{...props}
		>
			<div className="ayy-flex ayy-w-fit ayy-flex-row ayy-items-center ayy-justify-between">
				<Tab>
					<FaListUl className="ayy-size-5" />
				</Tab>
				<Tab>
					<IoGridOutline className="ayy-size-5" />
				</Tab>
			</div>
			<Tab>
				<IoTrashOutline className="ayy-size-5" />
			</Tab>
		</div>
	);
};

export function NotesView() {
	const files = useStore((state) => state.notes);

	return (
		<div className="ayy-flex ayy-flex-col ayy-bg-white ayy-h-full ayy-w-full  ayy-flex-grow">
			<NotesViewHeader />
			<div className="ayy-w-full ayy-h-full ayy-p-2 ayy-gap-2">
				{files.length > 0 &&
					files.map(
						(file) =>
							file.extension == "md" && (
								<Note key={file.path} file={file} />
							)
					)}

				{files.length === 0 && (
					<div className="ayy-w-full ayy-h-full ayy-flex ayy-items-center  ayy-justify-center ayy-text-gray-400">
						No Notes
					</div>
				)}
			</div>
		</div>
	);
}
