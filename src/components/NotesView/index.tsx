import { useStore } from "store";
import { Note } from "components/Note";
import { ReactNode } from "react";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { List as ListIcon } from "components/Icons/List";
import { Grid } from "components/Icons/Grid";
import { Trash } from "components/Icons/Trash";

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
          <ListIcon style={{ transform: "scale(1.5)" }} />
        </Tab>
        <Tab>
          <Grid style={{ transform: "scale(1.5)" }} />
        </Tab>
      </div>
      <Tab>
        <Trash style={{ transform: "scale(1.5)" }} />
      </Tab>
    </div>
  );
};

export function NotesView() {
  const files = useStore((state) => state.notes);
  const notes = files.filter((file) => file.extension == "md");
  const RowRenderer = (props: ListRowProps) => (
    <div aria-label="" key={notes[props.index].path} style={props.style}>
      <Note file={notes[props.index]} />
    </div>
  );

  return (
    <div className="onb-flex onb-flex-col onb-bg-white onb-h-full onb-w-full  onb-flex-grow">
      <NotesViewHeader />

      <div className="onb-w-full onb-h-full onb-p-2 onb-gap-2">
        {notes.length > 0 && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={notes.length}
                rowHeight={64}
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
