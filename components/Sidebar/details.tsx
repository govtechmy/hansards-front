import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { cn } from "@lib/helpers";
import { ComponentProps, ReactElement, useEffect, useState } from "react";
import { Collapse } from "./collapse";

export const Details = ({
  children,
  className,
  open,
  onOpen,
  summary,
  ...props
}: ComponentProps<"details"> & { summary: ReactElement; onOpen: () => void }): ReactElement => {
  const [openState, setOpen] = useState(!!open);

  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(openState);
  useEffect(() => {
    if (openState) {
      setDelayedOpenState(true);
    } else {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500);
      return () => clearTimeout(timeout);
    }
  }, [openState]);
  return (
    <details
      className="bg-background"
      {...props}
      open={delayedOpenState}
      {...(openState && { "data-expanded": true })}
    >
      <summary
        className={cn(
          "mr-px flex justify-between gap-3 cursor-pointer list-none items-center px-5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800",
          className
        )}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
          onOpen();
        }}
      >
        {summary}
        <ChevronRightIcon
          className={cn(
            "h-4.5 w-4.5 -mx-1 shrink-0 transition-transform",
            openState && "rotate-90"
          )}
        />
      </summary>
      <Collapse isOpen={openState}>{children}</Collapse>
    </details>
  );
};
