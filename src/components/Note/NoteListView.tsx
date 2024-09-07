import { memo } from "react";
import { NoteCommonProps } from "./types";


// className={`onb-p-3 ${backgroundColorClass} onb-rounded onb-flex onb-flex-col onb-items-center onb-gap-3`}

export const NoteListView = memo(
  ({
    description,
    imageLink,
    title,
    lastModificationTimeOrDate,
    ...divProps
  }: NoteCommonProps) => {
    return (
      <div {...divProps}>
        <div className="onb-flex-grow onb-flex-col onb-truncate">
          <div className="onb-text-[length:--onb-note-text-title-size] onb-font-semibold onb-truncate">
            {title}
          </div>
          <div className="onb-flex onb-flex-row onb-gap-2 onb-w-full">
            <div className="onb-text-[length:--onb-note-text-description-size] onb-font-normal onb-text-[color:--onb-note-text-date-color] onb-text-nowrap">
              {lastModificationTimeOrDate}
            </div>
            <div className="onb-text-[color:--onb-note-text-description-color] onb-truncate onb-text-[length:--onb-note-text-description-size]">
              {description}
            </div>
          </div>
        </div>
        {imageLink && (
          <img
            src={imageLink}
            className="onb-border onb-object-cover onb-object-top onb-size-9 onb-border-gray-300 onb-rounded"
          />
        )}
      </div>
    );
  }
);
