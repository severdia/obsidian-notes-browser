import { memo } from "react";
import { NoteCommonProps } from "./types";

export const NoteGridView = memo(
  ({
    description,
    imageLink,
    title,
    lastModificationTimeOrDate,
    ...divProps
  }: NoteCommonProps) => {
    return (
      <div {...divProps}>
        <div className="onb-w-full onb-px-3 onb-pt-3 onb-rounded-lg onb-h-fit onb-border-solid onb-border-[#eaeaea] onb-border-2 onb-gap-7 onb-flex onb-flex-col onb-items-center">
          <div className="onb-w-full onb-h-10">
            <div className="onb-w-full text-[14px] onb-font-bold onb-line-clamp-2">
              {title}
            </div>
          </div>

          <div className="onb-w-full onb-h-[148px]">
            {imageLink && (
              <img
                src={imageLink}
                className="onb-border onb-w-full onb-h-[148px] onb-object-cover onb-object-top onb-border-gray-300"
              />
            )}
            {!imageLink && (
              <div className="onb-line-clamp-[7]">{description}</div>
            )}
          </div>
        </div>
        <div className="onb-w-full onb-h-fit onb-flex onb-flex-col onb-items-center">
          <div className="onb-truncate onb-max-w-full">{title}</div>

          <div className="onb-text-[12px] onb-font-normal  onb-max-w-full onb-w-fit onb-text-[#272727] onb-text-nowrap">
            {lastModificationTimeOrDate}
          </div>
        </div>
      </div>
    );
  }
);
