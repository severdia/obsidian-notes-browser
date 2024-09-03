import { useStore } from "store";
import { HTMLAttributes, memo, useMemo } from "react";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { List as ListIcon } from "components/Icons/List";
import { Grid } from "components/Icons/Grid";
import { Trash } from "components/Icons/Trash";
import { Note } from "components/Note";

interface TabProps extends HTMLAttributes<HTMLDivElement> {
  tabId?: "LIST" | "GRID";
}

const Tab = (props: TabProps) => {
  const { setNotesViewType, notesViewType } = useStore((state) => ({
    setNotesViewType: state.setNotesViewType,
    notesViewType: state.notesViewType,
  }));

  const styleClasses =
    notesViewType === props.tabId
      ? "onb-bg-[#F2F2F2] onb-text-[#494a49]"
      : "onb-text-[#757575]";
  const { tabId, ...divProps } = props;

  return (
    <div
      className={`onb-px-4 ${styleClasses} onb-py-4 onb-rounded-md  onb-h-5 onb-flex onb-items-center onb-justify-center onb-cursor-pointer`}
      onClick={() => tabId && setNotesViewType(tabId)}
      {...divProps}
    >
      {props.children}
    </div>
  );
};
const NotesViewHeader = memo((props: React.ComponentProps<"div">) => {
  return (
    <div
      className="onb-flex onb-w-full onb-flex-row onb-h-12 onb-border-0 onb-items-center onb-py-2 onb-border-b-[var(--divider-color)] onb-border-b-[1.5px] onb-justify-between onb-border-solid onb-px-2 onb-text-[var(--icon-color)]"
      {...props}
    >
      <div className="onb-flex onb-w-fit onb-flex-row onb-gap-1 onb-items-center onb-justify-between">
        <Tab tabId="LIST">
          <ListIcon style={{ transform: "scale(1.75)" }} />
        </Tab>
        <Tab tabId="GRID">
          <Grid style={{ transform: "scale(1.75)" }} />
        </Tab>
      </div>
      <Tab>
        <Trash style={{ transform: "scale(1.75)" }} />
      </Tab>
    </div>
  );
});

export function NotesView() {
  const { files, notesViewType } = useStore((state) => ({
    files: state.notes,
    notesViewType: state.notesViewType,
  }));

  const notes = useMemo(
    () => files.filter((file) => file.extension == "md"),
    [files]
  );

  const RowRenderer = (props: ListRowProps) => (
    <div aria-label="" key={notes[props.index].path} style={props.style}>
      <Note file={notes[props.index]} />
    </div>
  );

  return (
    <div className="onb-flex onb-flex-col onb-bg-white onb-h-full onb-w-full  onb-flex-grow">
      <NotesViewHeader />

      <div className="onb-w-full onb-h-full onb-py-2 onb-pl-2 onb-gap-2">
        {notes.length > 0 && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="onb-pr-2"
                width={width}
                height={height}
                rowCount={notes.length}
                rowHeight={notesViewType === "LIST" ? 64 : 302}
                rowRenderer={RowRenderer}
                aria-label=""
              />
            )}
          </AutoSizer>
        )}

        {notes.length === 0 && (
          <div className="onb-w-full onb-h-full onb-flex onb-items-center  onb-justify-center onb-text-gray-400">
            No Notes
          </div>
        )}
      </div>
    </div>
  );
}
