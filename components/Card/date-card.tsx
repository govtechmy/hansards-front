/**
 * Date Card
 * @overview Status: In-development
 */

import { cn } from "@lib/helpers";

interface DateCardProps {
  className?: string;
  date: string;
  size: "sm" | "lg";
}

const DateCard = ({ className, date, size }: DateCardProps) => {
  const _date = (date ? new Date(date) : new Date()).toDateString().split(" ");

  return (
    <>
      <div
        className={cn(
          "shadow-button p-1.5 h-auto max-sm:max-h-20 flex-col flex justify-center text-center border border-slate-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 select-none",
          {
            "w-[50px] lg:w-[60px]": size == "sm",
            "w-[60px] lg:w-[80px]": size == "lg",
          },
          className
        )}
      >
        <span
          className={cn(
            "uppercase text-[#AE2929]",
            {
              "text-[10px] leading-[14px] lg:text-xs": size == "sm",
              "lg:text-sm lg:font-medium": size == "lg",
            },
          )}
        >
          {_date[1]}
        </span>
        <span
          className={cn(
            "text-zinc-900 dark:text-white",
            {
              "text-[16px] leading-5 font-medium lg:text-xl lg:font-semibold": size == "sm",
              "lg:text-[32px] lg:leading-tight font-semibold": size == "lg",
            },
          )}
        >
          {_date[2]}
        </span>
        <span
          className={cn(
            "text-dim",
            {
              "text-[10px] leading-[14px] lg:text-xs": size == "sm",
              "lg:text-sm lg:font-medium": size == "lg",
            },
          )}
        >
          {_date[3]}
        </span>
      </div>
    </>
  );
};

export default DateCard;
