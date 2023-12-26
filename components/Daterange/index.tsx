import Calendar from "@components/Calendar";
import { Transition, Popover } from "@headlessui/react";
import { ArrowRightIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { cn } from "@lib/helpers";
import { format, isAfter, isBefore, isValid, parse } from "date-fns";
import enGB from "date-fns/locale/en-GB";
import ms from "date-fns/locale/ms";
import { useTranslation } from "next-i18next";
import { ChangeEventHandler, useState } from "react";
import {
  type DateBefore,
  type DayPickerRangeProps,
  type DateRange,
  SelectRangeEventHandler,
} from "react-day-picker";

interface DateRangeProps extends Omit<DayPickerRangeProps, "mode"> {
  disabled?: boolean;
  anchor?: "left" | "right" | string;
  placeholder?: string;
  label?: string;
  numberOfMonths?: number;
  from: (date: string) => void;
  to: (date: string) => void;
}

const Daterange = ({
  className,
  disabled,
  anchor = "left",
  placeholder,
  label,
  numberOfMonths = 2,
  selected,
  from,
  to,
}: DateRangeProps) => {
  const { i18n } = useTranslation();

  const FIRST_PARLIMEN_DATE: DateBefore = {
    before: new Date(1959, 8, 11),
  };

  const DEFAULT_DATE = new Date();
  DEFAULT_DATE.setMonth(
    DEFAULT_DATE.getMonth() - (numberOfMonths === 2 ? 1 : 0)
  );

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined
  );
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFromValue(e.target.value);
    from(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());

    if (!isValid(date)) {
      return setSelectedRange({ from: undefined, to: undefined });
    }
    if (selectedRange?.to && isAfter(date, selectedRange.to)) {
      setSelectedRange({ from: selectedRange.to, to: date });
    } else {
      setSelectedRange({ from: date, to: selectedRange?.to });
    }
  };

  const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToValue(e.target.value);
    to(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());

    if (!isValid(date)) {
      return setSelectedRange({ from: selectedRange?.from, to: undefined });
    }
    if (selectedRange?.from && isBefore(date, selectedRange.from)) {
      setSelectedRange({ from: date, to: selectedRange.from });
    } else {
      setSelectedRange({ from: selectedRange?.from, to: date });
    }
  };

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined
  ) => {
    setSelectedRange(range);
    if (range?.from) {
      const from_date = format(range.from, "y-MM-dd");
      setFromValue(from_date);
      from(from_date);
    } else {
      setFromValue("");
    }
    if (range?.to) {
      const to_date = format(range.to, "y-MM-dd");
      setToValue(to_date);
      to(to_date);
    } else {
      setToValue("");
    }
  };

  return (
    <Popover className="relative">
      <Popover.Button
        className={cn(
          "shadow-button flex items-center gap-1.5 rounded-md px-3 py-1.5 text-start text-sm font-medium text-zinc-900 dark:text-white",
          "active:bg-slate-100 hover:dark:bg-zinc-800/50 active:dark:bg-zinc-800 select-none bg-white dark:bg-zinc-900",
          "border-slate-200 dark:border-zinc-800 hover:border-slate-400 hover:dark:border-zinc-700 border outline-none",
          disabled &&
            "disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:border-slate-200 dark:disabled:border-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-700 disabled:pointer-events-none disabled:cursor-not-allowed",
          className
        )}
        disabled={disabled}
      >
        <CalendarIcon className="text-zinc-900 dark:text-white h-4.5 w-4.5" />
        <span className="text-zinc-900 dark:text-white">
          {label}
          {selected && ":"}
        </span>
        {selected?.from ? (
          selected?.to ? (
            <>
              {format(new Date(selected?.from), "P", { locale: ms })} -{" "}
              {format(new Date(selected?.to), "P", { locale: ms })}
            </>
          ) : (
            format(new Date(selected?.from), "P", { locale: ms })
          )
        ) : (
          <span>{placeholder}</span>
        )}
      </Popover.Button>
      <Transition
        as={"div"}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel
          className={cn(
            "max-h-100 dark:ring-slate-800 shadow-floating absolute z-20 mt-1 overflow-clip rounded-md bg-white text-sm ring-1 ring-zinc-900 ring-opacity-5 focus:outline-none dark:bg-zinc-900",
            anchor === "right"
              ? "right-0"
              : anchor === "left"
              ? "left-0"
              : anchor
          )}
        >
          <form className="pt-3 px-3 hidden sm:flex items-center gap-x-3">
            <input
              type="date"
              className="text-center w-full rounded-md px-3 py-1.5 text-sm dark:bg-zinc-900 dark:text-white focus:ring-2 ring-blue-600 dark:ring-primary-dark focus:outline-none"
              value={fromValue}
              onChange={handleFromChange}
              min="1959-08-11"
              max={new Date().toISOString().slice(0, 10)}
            />
            <ArrowRightIcon className="h-4.5 w-4.5 shrink-0 text-zinc-500" />
            <input
              type="date"
              className="text-center w-full rounded-md px-3 py-1.5 text-sm dark:bg-zinc-900 dark:text-white focus:ring-2 ring-blue-600 dark:ring-primary-dark focus:outline-none"
              value={toValue}
              onChange={handleToChange}
              min={fromValue}
              max={new Date().toISOString().slice(0, 10)}
            />
          </form>
          <Calendar
            locale={i18n.language.startsWith("ms") ? ms : enGB}
            initialFocus
            mode="range"
            defaultMonth={DEFAULT_DATE}
            selected={selectedRange}
            onSelect={handleRangeSelect}
            numberOfMonths={numberOfMonths}
            disabled={[FIRST_PARLIMEN_DATE, { after: new Date() }]}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Daterange;
