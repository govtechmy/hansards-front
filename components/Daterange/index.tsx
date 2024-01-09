import Calendar from "@components/Calendar";
import { Transition, Popover } from "@headlessui/react";
import { ArrowRightIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { cn } from "@lib/helpers";
import {
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  subSeconds,
} from "date-fns";
import { enGB, ms } from "date-fns/locale";
import { useTranslation } from "next-i18next";
import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import {
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
  setSelected: Dispatch<SetStateAction<DateRange | undefined>>;
}

const Daterange = ({
  className,
  disabled,
  anchor = "left",
  placeholder,
  label,
  numberOfMonths = 2,
  selected,
  setSelected,
}: DateRangeProps) => {
  const { t, i18n } = useTranslation("home");

  const PARLIMEN_START_DATE = new Date("1959-08-11T00:00:00");

  const TODAY = new Date();
  const DEFAULT = new Date();
  DEFAULT.setMonth(TODAY.getMonth() - (numberOfMonths === 2 ? 1 : 0));

  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  const [invalidFromValue, setInvalidFromValue] = useState<string>("");
  const [invalidToValue, setInvalidToValue] = useState<string>("");

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFromValue(e.target.value);
    const date = parse(e.target.value, "yyyy-MM-dd", TODAY);

    // if year below 1000
    if (e.target.value.startsWith("0")) setInvalidFromValue("");
    else if (
      isValid(date) &&
      isAfter(date, subSeconds(PARLIMEN_START_DATE, 1)) &&
      isBefore(date, TODAY)
    ) {
      setSelected({ from: date, to: selected?.to });
      setInvalidFromValue("");
    } else {
      setSelected({ from: undefined, to: undefined });
      setInvalidFromValue(() => {
        if (isBefore(date, PARLIMEN_START_DATE)) return t("choose_later_date");
        else if (isAfter(date, TODAY)) return t("today_or_earlier");
        else return t("invalid_date");
      });
    }
  };

  const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToValue(e.target.value);
    const date = parse(e.target.value, "yyyy-MM-dd", TODAY);
    const fromDate = subSeconds(
      selected?.from ? selected.from : PARLIMEN_START_DATE,
      1
    );

    // if year below 1000
    if (e.target.value.startsWith("0")) setInvalidToValue("");
    else if (
      isValid(date) &&
      isAfter(date, fromDate) &&
      isBefore(date, TODAY)
    ) {
      setSelected({ from: selected?.from, to: date });
      setInvalidToValue("");
    } else {
      setSelected({ from: selected?.from, to: undefined });
      setInvalidToValue(() => {
        if (isBefore(date, fromDate)) return t("choose_later_date");
        else if (isAfter(date, TODAY)) return t("today_or_earlier");
        else return t("invalid_date");
      });
    }
  };

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined
  ) => {
    setSelected(range);
    if (range?.from) {
      const from_date = format(range.from, "yyyy-MM-dd");
      setFromValue(from_date);
    } else {
      setFromValue("");
    }
    if (range?.to) {
      const to_date = format(range.to, "yyyy-MM-dd");
      setToValue(to_date);
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
          {(selected || placeholder) && ":"}
        </span>
        {selected?.from ? (
          selected?.to ? (
            <>
              {format(new Date(selected?.from), "dd-MM-yyyy", { locale: ms })}
              <ArrowRightIcon className="h-3 w-3" />
              {format(new Date(selected?.to), "dd-MM-y", { locale: ms })}
            </>
          ) : (
            <>
              {format(new Date(selected?.from), "dd-MM-yyyy", { locale: ms })}
              <ArrowRightIcon className="h-3 w-3" />
              dd/mm/yyyy
            </>
          )
        ) : (
          <>{placeholder}</>
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
            "min-w-full max-h-100 shadow-floating absolute z-20 mt-1 rounded-md bg-white text-sm focus:outline-none dark:bg-zinc-900",
            anchor === "right"
              ? "right-0"
              : anchor === "left"
              ? "left-0"
              : anchor
          )}
        >
          <form className="pt-3 px-3 flex flex-col">
            <div className="flex items-center gap-x-3">
              <input
                type="date"
                className={cn(
                  "btn-default text-center w-full focus:ring-2 ring-blue-600 dark:ring-primary-dark focus:outline-none focus:border-none",
                  invalidFromValue && "invalid:ring-red-600"
                )}
                value={fromValue}
                onChange={handleFromChange}
                onClick={(event) => event.preventDefault()}
                min="1959-08-11"
                max={toValue ? toValue : TODAY.toISOString().slice(0, 10)}
              />
              <ArrowRightIcon className="h-4.5 w-4.5 shrink-0 text-zinc-500" />
              <input
                type="date"
                className={cn(
                  "btn-default text-center w-full focus:ring-2 ring-blue-600 dark:ring-primary-dark focus:outline-none focus:border-none",
                  invalidToValue && "invalid:ring-red-600"
                )}
                value={toValue}
                onChange={handleToChange}
                onClick={(event) => event.preventDefault()}
                min={fromValue ? fromValue : "1959-08-11"}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="flex gap-[42px] pt-1">
              <p className="text-xs text-red-600 w-full">{invalidFromValue}</p>
              <p className="text-xs text-red-600 w-full">{invalidToValue}</p>
            </div>
          </form>

          <Calendar
            locale={i18n.language.startsWith("ms") ? ms : enGB}
            initialFocus
            mode="range"
            defaultMonth={DEFAULT}
            selected={selected}
            onSelect={handleRangeSelect}
            numberOfMonths={numberOfMonths}
            disabled={[
              {
                before: PARLIMEN_START_DATE,
              },
              { after: TODAY },
            ]}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Daterange;
