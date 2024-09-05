import { IcChevronBase } from "./ChevronBase";

export const Chevron = ({
  direction,
  isActive,
}: {
  direction: "forward" | "down";
  isActive: boolean;
}) => {
  const style = direction == "forward" ? {} : { transform: "rotate(90deg)" };
  const chevronStyleClasses = isActive
    ? "onb-text-white"
    : "onb-text-[#616064]";
    
  return (
    <IcChevronBase
      style={style}
      className={`onb-size-fit ${chevronStyleClasses}  onb-min-w-fit`}
    />
  );
};
