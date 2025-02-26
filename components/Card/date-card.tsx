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
          "flex h-fit select-none flex-col justify-center rounded-md border border-slate-200 bg-white p-1.5 text-center shadow-button dark:border-zinc-700 dark:bg-zinc-900 max-sm:max-h-20",
          {
            "w-[50px] lg:w-[60px]": size == "sm",
            "w-[60px] lg:w-[80px]": size == "lg",
          },
          className
        )}
      >
        <span
          className={cn("uppercase text-[#AE2929]", {
            "text-[10px] leading-[14px] lg:text-xs": size == "sm",
            "text-xs lg:text-sm lg:font-medium": size == "lg",
          })}
        >
          {_date[1]}
        </span>
        <span
          className={cn("text-zinc-900 dark:text-white", {
            "text-[16px] font-medium leading-5 lg:text-xl lg:font-semibold":
              size == "sm",
            "text-xl font-semibold lg:text-[32px] lg:leading-tight":
              size == "lg",
          })}
        >
          {_date[2]}
        </span>
        <span
          className={cn("text-dim", {
            "text-[10px] leading-[14px] lg:text-xs": size == "sm",
            "text-xs lg:text-sm lg:font-medium": size == "lg",
          })}
        >
          {_date[3]}
        </span>
      </div>
    </>
  );
};

export default DateCard;
