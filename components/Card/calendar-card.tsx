/**
 * Calendar Card
 * @overview Status: In-development
 */

import { cn } from "@lib/helpers";

interface CalendarCardProps {
  className?: string;
  date: string;
  size: "sm" | "lg";
}

const CalendarCard = ({ className, date, size }: CalendarCardProps) => {
  const _date = (date ? new Date(date) : new Date()).toDateString().split(" ");

  return (
    <>
      <div
        className={cn(
          "shadow-button p-1.5 w-[60px] h-auto max-sm:max-h-20 flex-col flex justify-center text-center border border-slate-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900",
          size == "lg" && "lg:w-[80px]",
          className
        )}
      >
        <span
          className={cn(
            "uppercase text-xs text-[#AE2929]",
            size == "lg" && "lg:text-sm lg:font-medium"
          )}
        >
          {_date[1]}
        </span>
        <span
          className={cn(
            "font-semibold text-xl text-zinc-900 dark:text-white",
            size == "lg" && "lg:text-[32px] lg:leading-tight"
          )}
        >
          {_date[2]}
        </span>
        <span
          className={cn(
            "text-xs text-dim",
            size == "lg" && "lg:text-sm lg:font-medium"
          )}
        >
          {_date[3]}
        </span>
      </div>
    </>
  );
};

export default CalendarCard;
