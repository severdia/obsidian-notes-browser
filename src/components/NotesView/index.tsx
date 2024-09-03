import { useStore } from "store";
import { memo, useMemo } from "react";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { List as ListIcon } from "components/Icons/List";
import { Grid } from "components/Icons/Grid";
import { Trash } from "components/Icons/Trash";
import { Note } from "components/Note";

const Tab = (props: React.ComponentProps<"div">) => (
  <div
    className="onb-h-fit onb-px-2 onb-flex onb-items-center onb-justify-center"
    {...props}
  >
    {props.children}
  </div>
);

const NotesViewHeader = memo((props: React.ComponentProps<"div">) => {
  const setNotesViewType = useStore((state) => state.setNotesViewType);
  return (
    <div
      className="onb-flex onb-w-full onb-flex-row onb-border-0 onb-items-center onb-py-2 onb-border-b-[var(--divider-color)] onb-border-b-[1.5px] onb-justify-between onb-border-solid onb-px-2 onb-text-[var(--icon-color)]"
      {...props}
    >
      <div className="onb-flex onb-w-fit onb-flex-row onb-items-center onb-justify-between">
        <Tab onClick={() => setNotesViewType("LIST")}>
          <ListIcon style={{ transform: "scale(1.5)" }} />
        </Tab>
        <Tab onClick={() => setNotesViewType("GRID")}>
          <Grid style={{ transform: "scale(1.5)" }} />
        </Tab>
      </div>
      <Tab>
        <Trash style={{ transform: "scale(1.5)" }} />
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
