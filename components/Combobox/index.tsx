import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { Button, Spinner } from "..";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCombobox } from "downshift";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
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
  className?: string;
  dropdown?: ReactNode;
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
  className,
  dropdown,
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
    overscan: 15,
  });

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    openMenu,
    reset,
    selectItem,
    selectedItem,
  } = useCombobox({
    items,
    itemToString: (item) => (item ? item.label : ""),
    inputValue,
    onInputValueChange: ({ inputValue: newValue }) => setInputValue(newValue ? newValue : ""),
    scrollIntoView: () => { },
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
        rowVirtualizer.scrollToIndex(highlightedIndex!);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) onChange(selectedItem);
    }
  });

  return (
    <div className="relative">
      <div>
        <label {...getLabelProps()}>{ }</label>
        <div
          className={cn(
            "h-[50px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 relative flex w-full select-none overflow-visible rounded-full border focus:outline-none focus-visible:ring-0",
            className
          )}
        >
          {dropdown ? (
            dropdown
          ) : (
            <span className="ml-4 flex h-auto max-h-8 w-8 shrink-0 justify-center self-center z-10">
              {icon && selected ? (
                icon(selected.value)
              ) : (
                <MagnifyingGlassIcon className="dark:text-zinc-500 h-5 w-5 text-zinc-900" />
              )}
            </span>
          )}
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
            className={cn(
              "w-full h-12 truncate border-none pr-9 py-3 focus:outline-none focus:ring-0 bg-white dark:bg-zinc-900",
              dropdown
                ? "pl-2.5 rounded-r-full"
                : "absolute top-0 left-0 pl-14 rounded-full"
            )}
          />
          {inputValue && (
            <Button
              className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
              onClick={() => {
                reset();
                setInputValue("");
                openMenu();
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
            </Button>
          )}
        </div>
      </div>
      <div className="absolute top-[54px] left-0 w-full z-10">
        <ul
          {...getMenuProps({ ref: listRef })}
          className={cn(
            "text-sm shadow-floating relative max-h-60 max-w-full overflow-y-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md",
            !(isOpen && items.length) && "hidden"
          )}
        >
          {isOpen &&
            (loading ? (
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
                {rowVirtualizer.virtualItems.map((virtualRow) => (
                  <ComboOption<T>
                    option={items[virtualRow.index]}
                    total={options.length}
                    format={format}
                    icon={icon}
                    isSelected={selectedItem === items[virtualRow.index]}
                    active={highlightedIndex === virtualRow.index}
                    index={virtualRow.index}
                    {...getItemProps({
                      index: virtualRow.index,
                      item: items[virtualRow.index],
                      onClick: () => selectItem(items[virtualRow.index])
                      ,
                    })}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                ))}
              </>
            ) : (
              items.map((item, i) => (
                <ComboOption<T>
                  option={item}
                  total={options.length}
                  format={format}
                  icon={icon}
                  isSelected={selectedItem === items[i]}
                  active={highlightedIndex === i}
                  index={i}
                  {...getItemProps({
                    index: i,
                    item: item,
                    onClick: () => selectItem(items[i]),
                  })}
                />
              ))
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ComboBox;
