import { cn } from "@lib/helpers";
import { FunctionComponent } from "react";
import { Spinner } from "..";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

const Skeleton: FunctionComponent<SkeletonProps> = ({
  className,
  height = "h-full",
  width = "w-full",
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        height,
        width,
        className
      )}
    >
      <Spinner loading={true} />
    </div>
  );
};

export default Skeleton;
