import { IcChevron } from "./IcChevron";

export const IcChevronBase = ({
  direction,
  isActive,
}: {
  direction: "forward" | "down";
  isActive: boolean;
}) => {
  const style = direction == "forward" ? {} : { transform: "rotate(90deg)" };
  return (
    <IcChevron
      style={style}
      fill={isActive ? "white" : "#616064"}
      className="onb-size-fit  onb-min-w-fit"
    />
  );
};
