import { cn } from "@lib/helpers";
import { FunctionComponent, ReactNode } from "react";

type ContainerProps = {
  background?: string;
  className?: string;
  children?: ReactNode;
};

const Container: FunctionComponent<ContainerProps> = ({
  background,
  className,
  children,
}) => {
  return (
    <div className={cn("flex h-full w-full justify-center", background)}>
      <div
        className={cn(
          "md:px-4.5 divide-y divide-slate-200 dark:divide-zinc-800 h-full w-full max-w-screen-2xl px-3 lg:px-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
