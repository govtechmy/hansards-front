import Input from "../Input";
import { default as Label, LabelProps } from "../Label";
import type { OptionType } from "@lib/types";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@lib/helpers";
import { matchSorter } from "match-sorter";
import { useTranslation } from "next-i18next";
import { default as Image } from "next/image";
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
  useRef,
} from "react";

type CommonProps = {
  className?: string;
  disabled?: boolean;
  options: OptionType[];
  description?: string;
  icon?: ReactNode;
  width?: string;
  label?: string;
  sublabel?: ReactNode;
  anchor?: "left" | "right" | string;
  enableSearch?: boolean;
  enableFlag?: boolean;
  flag?: (value: string) => ReactNode;
  enableClear?: boolean;
};

type ConditionalProps =
  | {
      multiple?: true;
      selected?: OptionType[];
      title: string;
      placeholder?: never;
      onChange: (selected: any) => void;
    }
  | {
      multiple?: false;
      selected?: OptionType;
      title?: never;
      placeholder?: ReactNode;
      onChange: (selected: any) => void;
    };

type DropdownProps = CommonProps & ConditionalProps & LabelProps;

const Dropdown: FunctionComponent<DropdownProps> = ({
  className = "",
  disabled = false,
  multiple = false,
  icon,
  options,
  selected,
  onChange,
  enableSearch,
  title,
  description,
  anchor = "left",
  placeholder,
  width = "w-full lg:w-fit",
  label,
  sublabel,
  enableFlag = false,
  flag,
  enableClear = false,
}) => {
  const [search, setSearch] = useState<string>("");
  const optionsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isSelected = (option: OptionType): boolean => {
    return (
      multiple &&
      (selected as OptionType[]).some(
        (item: OptionType) => item.value === option.value
      )
    );
  };

  const handleDeselect = (option: OptionType): any => {
    return (selected as OptionType[]).filter(
      (item: OptionType) => item.value !== option.value
    );
  };
  const handleChange = (options: any) => {
    if (!multiple) return onChange(options);

    const added = options;
    if (!isSelected(added)) {
      selected && Array.isArray(selected)
        ? onChange([...selected, options])
        : onChange([options]);
    } else {
      onChange(handleDeselect(added));
    }
  };

  const availableOptions = useMemo<OptionType[]>(() => {
    if (!enableSearch) return options;

    return matchSorter(options, search.toLowerCase(), { keys: ["label"] });
  }, [options, search]);

  const ListboxOption = ({
    option,
    index,
    style,
  }: {
    option: OptionType;
    index: number;
    style: any;
  }) => (
    <Listbox.Option
      key={index}
      style={style}
      className={({ active }) =>
        cn(
          "relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4",
          multiple ? "pl-10" : "pl-4",
          active && "bg-bg-hover"
        )
      }
      onClick={() => (multiple ? handleChange(option) : null)}
      value={option}
    >
      {/* State flag - optional */}
      {enableFlag &&
        (flag ? (
          flag(option.value)
        ) : (
          <Image
            src={`/static/images/states/${option.value}.jpeg`}
            width={20}
            height={12}
            alt={option.label as string}
          />
        ))}

      {/* Option label */}
      <span
        className={cn(
          "block flex-grow truncate",
          option === selected ? "font-medium" : "font-normal"
        )}
      >
        {option.label}
      </span>

      {/* Checkbox (multiple mode) */}
      {multiple && (
        <span className="absolute inset-y-0 left-3 flex items-center">
          <input
            type="checkbox"
            checked={
              selected &&
              (selected as OptionType[]).some(
                item => item.value === option.value
              )
            }
            className="text-primary dark:checked:border-primary h-4 w-4 rounded border-slate-200 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:checked:bg-primary-dark"
          />
        </span>
      )}

      {/* Checkmark */}
      {!multiple &&
        selected &&
        (selected as OptionType).value === option.value && (
          <CheckCircleIcon className="disabled: text-primary h-4 w-4 dark:text-primary-dark" />
        )}
    </Listbox.Option>
  );

  return (
    <div className={cn("space-y-3", width)}>
      {label && <Label label={label}></Label>}
      <Listbox
        value={selected}
        onChange={(option: OptionType & OptionType[]) =>
          !multiple && handleChange(option)
        }
        multiple={multiple}
        disabled={disabled}
      >
        <div className="relative text-sm">
          <Listbox.Button
            className={cn(
              "flex min-w-full items-center gap-1.5 rounded-md px-3 py-1.5 shadow-button",
              "text-start text-sm font-medium text-foreground",
              "select-none bg-background active:bg-slate-100 hover:dark:bg-zinc-800/50 active:dark:bg-zinc-800",
              "border border-border hover:border-border-hover",
              disabled &&
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-700",
              width,
              className
            )}
          >
            <>
              {/* Icon */}
              {icon}

              {/* Sublabel */}
              {sublabel && (
                <span className="block w-fit min-w-min truncate text-foreground">
                  {sublabel}
                  {!multiple && selected && ":"}
                </span>
              )}

              {/* Flag (selected) */}
              {enableFlag &&
                selected &&
                (flag ? (
                  flag((selected as OptionType).value)
                ) : (
                  <div className="self-center">
                    <Image
                      src={`/static/images/states/${
                        (selected as OptionType).value
                      }.jpeg`}
                      width={20}
                      height={12}
                      alt={(selected as OptionType).label as string}
                    />
                  </div>
                ))}

              {/* Label */}
              <span className="flex flex-grow truncate">
                {multiple
                  ? title
                  : (selected as OptionType)?.label || placeholder}
              </span>
              {/* Label (multiple) */}
              {multiple && (selected as OptionType[])?.length > 0 && (
                <span className="h-5 w-4.5 rounded-md bg-bg-primary-600 text-center text-white">
                  {selected && (selected as OptionType[]).length}
                </span>
              )}

              {/* ChevronDown Icon */}
              <ChevronDownIcon
                className={cn(
                  "-mx-[5px] h-5 w-5 shrink-0",
                  sublabel ? "text-foreground" : "text-inherit",
                  disabled && "text-slate-400 dark:text-zinc-700"
                )}
              />
            </>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              ref={optionsRef}
              className={cn(
                "absolute z-20 mt-1 min-w-full rounded-md bg-background text-foreground shadow-floating",
                "max-h-60 overflow-auto",
                anchor === "right"
                  ? "right-0"
                  : anchor === "left"
                  ? "left-0"
                  : anchor
              )}
            >
              {/* Description - optional*/}
              {description && (
                <p className="px-3 pb-1 pt-2 text-xs text-zinc-500">
                  {description}
                </p>
              )}

              {/* Search - optional*/}
              {enableSearch && (
                <div className="border-b pt-1 dark:border-zinc-700">
                  <Input
                    type="search"
                    icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                    value={search}
                    className="border-none focus:ring-transparent"
                    placeholder={t("placeholder.search") + "..."}
                    onChange={value => setSearch(value)}
                  />
                </div>
              )}

              {availableOptions.map((option, index) => (
                <ListboxOption
                  key={index}
                  option={option}
                  index={index}
                  style={null}
                />
              ))}

              {/* Clear / Reset */}
              {enableClear && (
                <button
                  onClick={() =>
                    multiple ? onChange([]) : onChange(undefined)
                  }
                  className="group relative flex w-full cursor-default select-none items-center gap-2 border-t border-border py-3 pl-10 pr-4 text-zinc-500 hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={Array.isArray(selected) && selected.length === 0}
                >
                  <p>{t("clear")}</p>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <XMarkIcon className="h-5 w-5" />
                  </span>
                </button>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
