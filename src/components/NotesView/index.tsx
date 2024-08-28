import { useStore } from "store";
import { Note } from "components/Note";
import { IoGridOutline, IoTrashOutline } from "react-icons/io5";
import { ReactNode } from "react";
import { FaListUl } from "react-icons/fa";

const Tab = ({ children }: { children: ReactNode }) => (
  <div className="onb-h-fit onb-px-2 onb-flex onb-items-center onb-justify-center">
    {children}
  </div>
);

const NotesViewHeader = (props: React.ComponentProps<"div">) => {
  return (
    <div
      className="onb-flex onb-w-full onb-flex-row onb-border-0 onb-items-center onb-py-2 onb-border-b-[var(--divider-color)] onb-border-b-[1.5px] onb-justify-between onb-border-solid onb-px-2 onb-text-[var(--icon-color)]"
      {...props}
    >
      <div className="onb-flex onb-w-fit onb-flex-row onb-items-center onb-justify-between">
        <Tab>
          <FaListUl className="onb-size-5" />
        </Tab>
        <Tab>
          <IoGridOutline className="onb-size-5" />
        </Tab>
      </div>
      <Tab>
        <IoTrashOutline className="onb-size-5" />
      </Tab>
    </div>
  );
};

export function NotesView() {
  const files = useStore((state) => state.notes);

  return (
    <div className="onb-flex onb-flex-col onb-bg-white onb-h-full onb-w-full  onb-flex-grow">
      <NotesViewHeader />
      <div className="onb-w-full onb-h-full onb-p-2 onb-gap-2">
        {files.length > 0 &&
          files.map(
            (file) =>
              file.extension == "md" && <Note key={file.path} file={file} />
          )}

        {files.length === 0 && (
          <div className="onb-w-full onb-h-full onb-flex onb-items-center  onb-justify-center onb-text-gray-400">
            No Notes
          </div>
        )}
      </div>
    </div>
  );
}
