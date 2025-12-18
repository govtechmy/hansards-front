import { cn } from "@lib/helpers";
import { FunctionComponent, ReactNode } from "react";

type ContainerProps = {
  background?: string;
  className?: string;
  children?: ReactNode;
};

const Container: FunctionComponent<ContainerProps> = ({
  background = "bg-background",
  className,
  children,
}) => {
  return (
    <div className={cn("flex h-full w-full justify-center", background)}>
      <div
        className={cn(
          "container h-full w-full max-w-screen-2xl px-4.5 md:px-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
