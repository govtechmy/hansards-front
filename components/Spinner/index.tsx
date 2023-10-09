import { FunctionComponent } from "react";
import { cn } from "@lib/helpers";

interface SpinnerProps {
  loading: boolean;
  className?: string;
}

const Spinner: FunctionComponent<SpinnerProps> = ({ loading, className }) => {
  return loading ? (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-[50%] border-2 border-gray-300 border-t-zinc-900",
        className
      )}
    />
  ) : (
    <></>
  );
};

export default Spinner;
