import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { Button, Spinner } from "..";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { body } from "@lib/configs/font";
import { useCombobox } from "downshift";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

type ComboBoxProps<T> = Omit<
  ComboOptionProps<T>,
  "option" | "style" | "isSelected" | "active" | "index" | "setSize" | "total"
> & {
  options: ComboOptionProp<T>[];
  selected?: ComboOptionProp<T> | null;
  onChange: (option?: ComboOptionProp<T>) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  config?: MatchSorterOptions<ComboOptionProp<T>>;
};

const ComboBox = <T extends unknown>({
  options,
  selected,
  onChange,
  onSearch,
  format,
  placeholder,
  icon,
  loading = false,
  config = { keys: ["label"] },
}: ComboBoxProps<T>) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(
    selected ? selected.label : ""
  );

  const items = useMemo<ComboOptionProp<T>[]>(
    () => matchSorter(options, inputValue, config),
    [options, inputValue, config]
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: useCallback(() => 36, []),
    overscan: 2,
  });

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    selectedItem,
    isOpen,
    openMenu,
    closeMenu,
  } = useCombobox({
    items,
    itemToString: (item) => (item ? item.label : ""),
    inputValue,
    onInputValueChange: ({ inputValue: newValue }) => setInputValue(newValue!),
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
        rowVirtualizer.scrollToIndex(highlightedIndex!);
      }
    },
  });

  return (
    <div className="relative">
      <div>
        <label {...getLabelProps()}>{}</label>
        <div className="h-[50px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 relative flex w-full select-none overflow-hidden rounded-full border focus:outline-none focus-visible:ring-0">
          <span className="ml-4 flex h-auto max-h-8 w-8 shrink-0 justify-center self-center z-10">
            {icon && selected ? (
              icon(selected.value)
            ) : (
              <MagnifyingGlassIcon className="dark:text-zinc-500 h-5 w-5 text-zinc-900" />
            )}
          </span>
          <input
            {...getInputProps({
              "aria-autocomplete": "list",
              placeholder: placeholder,
              ref: inputRef,
              spellCheck: false,
              type: "text",
              onChange: (event: ChangeEvent<HTMLInputElement>) => {
                if (onSearch) onSearch(event.target.value);
              },
            })}
            className="absolute top-0 left-0 w-full h-12 truncate border-none bg-white pl-14 pr-9 py-3 focus:outline-none focus:ring-0 dark:bg-zinc-900"
          />
          {(inputValue.length > 0 || selected) && (
            <Button
              className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
              onClick={() => {
                setInputValue("");
                onChange(undefined);
                openMenu();
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
            </Button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-[54px] left-0 w-full z-10">
          <ul
            {...getMenuProps({
              ref: listRef,
            })}
            className={cn(
              body.variable,
              "font-body text-sm shadow-floating relative max-h-60 max-w-full overflow-y-auto bg-white dark:bg-zinc-900",
              "border border-slate-200 dark:border-zinc-800 rounded-md"
            )}
          >
            {loading ? (
              <li className="text-zinc-500 flex cursor-default select-none items-center gap-2 px-4 py-2">
                <Spinner loading={loading} /> {t("placeholder.loading")}
              </li>
            ) : items.length === 0 && inputValue !== "" ? (
              <li className="text-zinc-500 cursor-default select-none px-4 py-2">
                {t("placeholder.no_results")}
              </li>
            ) : items.length > 100 ? (
              <>
                <li
                  key="total-size"
                  style={{ height: rowVirtualizer.totalSize }}
                />
                {rowVirtualizer.virtualItems.map((virtualRow, i) => (
                  <ComboOption<T>
                    option={items[i]}
                    onClick={() => {
                      onChange(items[i]);
                      setInputValue(items[i].label);
                      closeMenu();
                    }}
                    total={options.length}
                    format={format}
                    icon={icon}
                    isSelected={selected?.value === items[i].value}
                    active={highlightedIndex === i}
                    index={i}
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    {...getItemProps}
                  />
                ))}
              </>
            ) : (
              items.map((item, i) => (
                <ComboOption<T>
                  option={item}
                  onClick={() => {
                    onChange(item);
                    setInputValue(item.label);
                    closeMenu();
                  }}
                  total={options.length}
                  format={format}
                  icon={icon}
                  isSelected={selected?.value === items[i].value}
                  active={highlightedIndex === i}
                  index={i}
                  {...getItemProps}
                />
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComboBox;
