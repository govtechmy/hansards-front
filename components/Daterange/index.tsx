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
import enGB from "date-fns/locale/en-GB/index.js";
import ms from "date-fns/locale/ms/index.js";
import { useTranslation } from "next-i18next";
import { ChangeEventHandler, useState } from "react";
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
  onChange: (dateRange?: DateRange) => void;
}

const Daterange = ({
  className,
  disabled,
  anchor = "left",
  placeholder,
  label,
  numberOfMonths = 2,
  selected,
  onChange,
}: DateRangeProps) => {
  const { t, i18n } = useTranslation("home");

  const PARLIMEN_START_DATE = new Date("1959-08-11T00:00:00");

  const TODAY = new Date();
  const DEFAULT = new Date();
  DEFAULT.setMonth(TODAY.getMonth() - (numberOfMonths === 2 ? 1 : 0));

  const [fromValue, setFromValue] = useState<string>(
    selected?.from ? selected.from.toISOString().slice(0, 10) : ""
  );
  const [toValue, setToValue] = useState<string>(
    selected?.to ? selected.to.toISOString().slice(0, 10) : ""
  );
  const [invalidFromValue, setInvalidFromValue] = useState<string>("");
  const [invalidToValue, setInvalidToValue] = useState<string>("");

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFromValue(e.target.value);
    const date = parse(e.target.value, "yyyy-MM-dd", TODAY);

    // if year below 1000
    if (e.target.value.startsWith("0")) setInvalidFromValue("");
    else if (
      isValid(date) &&
      isAfter(date, subSeconds(PARLIMEN_START_DATE, 1)) &&
      isBefore(date, TODAY)
    ) {
      onChange({ from: date, to: selected?.to });
      setInvalidFromValue("");
    } else {
      onChange({ from: undefined, to: undefined });
      setInvalidFromValue(() => {
        if (isBefore(date, PARLIMEN_START_DATE)) return t("choose_later_date");
        else if (isAfter(date, TODAY)) return t("today_or_earlier");
        else return t("invalid_date");
      });
    }
  };

  const handleToChange: ChangeEventHandler<HTMLInputElement> = e => {
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
      onChange({ from: selected?.from, to: date });
      setInvalidToValue("");
    } else {
      onChange({ from: selected?.from, to: undefined });
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
    onChange(range);
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
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-start text-sm font-medium text-txt-black-900 shadow-button",
          "select-none bg-bg-white hover:bg-bg-white-hover",
          "whitespace-nowrap border border-otl-gray-200 hover:border-otl-gray-300",
          disabled &&
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-otl-gray-200 disabled:bg-border disabled:text-txt-black-disabled",
          className
        )}
        disabled={disabled}
      >
        <CalendarIcon className="h-4.5 w-4.5 text-txt-black-900" />
        <span className="text-txt-black-900">
          {label}
          {(selected || placeholder) && ":"}
        </span>
        {selected?.from ? (
          selected?.to ? (
            <>
              {format(new Date(selected?.from), "dd-MM-yyyy", { locale: ms })}
              <ArrowRightIcon className="size-3" />
              {format(new Date(selected?.to), "dd-MM-y", { locale: ms })}
            </>
          ) : (
            <>
              {format(new Date(selected?.from), "dd-MM-yyyy", { locale: ms })}
              <ArrowRightIcon className="size-3" />
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
            "max-h-100 absolute z-20 mt-1 min-w-full rounded-md border border-otl-gray-200 bg-bg-white text-sm shadow-floating focus:outline-none",
            anchor === "right"
              ? "right-0"
              : anchor === "left"
                ? "left-0"
                : anchor
          )}
        >
          <form className="flex flex-col px-3 pt-3 max-sm:hidden">
            <div className="flex items-center gap-x-3">
              <input
                type="date"
                className={cn(
                  "btn-default w-full text-center ring-otl-primary-200 focus:border-none focus:outline-none focus:ring-2",
                  invalidFromValue && "invalid:ring-otl-danger-200"
                )}
                value={fromValue}
                onChange={handleFromChange}
                onClick={event => event.preventDefault()}
                min="1959-08-11"
                max={toValue ? toValue : TODAY.toISOString().slice(0, 10)}
              />
              <ArrowRightIcon className="size-4.5 shrink-0 text-txt-black-500" />
              <input
                type="date"
                className={cn(
                  "btn-default w-full text-center ring-otl-primary-200 focus:border-none focus:outline-none focus:ring-2",
                  invalidToValue && "invalid:ring-otl-danger-200"
                )}
                value={toValue}
                onChange={handleToChange}
                onClick={event => event.preventDefault()}
                min={fromValue ? fromValue : "1959-08-11"}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="flex gap-[42px] pt-1">
              <p className="w-full text-xs text-txt-danger">
                {invalidFromValue}
              </p>
              <p className="w-full text-xs text-txt-danger">{invalidToValue}</p>
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
