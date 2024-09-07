import { Note } from "components/Note";
import { TFile } from "obsidian";
import { AutoSizer, ListRowProps, List } from "react-virtualized";

export const GalleryView = ({ notes }: { notes: TFile[] }) => (
  <AutoSizer>
    {({ height, width }) => {
      const itemWidth = 365;
      const cellWidth = Math.floor(width / (itemWidth + 40));
      const maxColumns = Math.max(1, cellWidth);

      const rowCount = Math.ceil(notes.length / maxColumns);

      const GridRowRenderer = (props: ListRowProps) => (
        <div aria-label="" key={notes[props.index].path} style={props.style}>
          <div className="onb-flex onb-flex-row onb-justify-between">
            {notes
              .slice(
                maxColumns * props.index,
                maxColumns * props.index + maxColumns
              )
              .map((note) => (
                <Note file={note} key={note.path} />
              ))}
          </div>
        </div>
      );

      return (
        <List
          className="onb-pr-2"
          width={width}
          height={height}
          rowCount={rowCount}
          rowHeight={275 + 75}
          rowRenderer={GridRowRenderer}
          aria-label=""
        />
      );
    }}
  </AutoSizer>
);
