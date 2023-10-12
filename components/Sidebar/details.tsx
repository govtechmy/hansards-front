import { cn } from "@lib/helpers";
import { ComponentProps, ReactElement, useEffect, useState } from "react";

export const Details = ({
  children,
  className,
  open,
  summary,
  ...props
}: ComponentProps<"details"> & { summary: string }): ReactElement => {
  const [openState, setOpen] = useState(!!open);

  return (
    <details
      className={cn("bg-white dark:bg-neutral-900", className)}
      {...props}
      open={openState}
      {...(openState && { "data-expanded": true })}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center pl-5 pr-10 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
          "before:mr-1 before:inline-block before:transition-transform before:content-[''] dark:before:invert",
          "[[data-expanded]>&]:before:rotate-90"
        )}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        {summary}
      </summary>
      {children}
    </details>
  );
};
