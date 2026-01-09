import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { Button, Spinner } from "..";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCombobox } from "downshift";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import { ChangeEvent, ReactNode, useCallback, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

type ComboBoxProps<T> = Pick<ComboOptionProps<T>, "format" | "icon"> & {
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
  const [items, setItems] = useState(options);

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
    inputValue,
    isOpen,
    openMenu,
    reset,
    selectItem,
    selectedItem,
    setInputValue,
  } = useCombobox({
    defaultSelectedItem: selected,
    items,
    itemToString: item => (item ? item.label : ""),
    onInputValueChange: ({ inputValue }) =>
      setItems(matchSorter(options, inputValue, config)),
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
        rowVirtualizer.scrollToIndex(highlightedIndex!);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) onChange(selectedItem);
    },
  });

  return (
    <div className="relative">
      <div>
        <label {...getLabelProps()} />
        <div
          className={cn(
            "relative flex h-[50px] w-full select-none overflow-visible rounded-full border border-border bg-background hover:border-border-hover focus:outline-none focus-visible:ring-0",
            className
          )}
        >
          {dropdown ? (
            dropdown
          ) : (
            <span className="z-10 ml-4 flex h-auto max-h-8 w-8 shrink-0 justify-center self-center">
              {icon && selectedItem && inputValue ? (
                icon(selectedItem.value)
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-500" />
              )}
            </span>
          )}
          <input
            ref={inputRef}
            spellCheck={false}
            placeholder={placeholder}
            type="text"
            className={cn(
              "h-12 w-full truncate border-none bg-background py-3 pr-9 focus:outline-none focus:ring-0",
              dropdown
                ? "rounded-r-full pl-2.5"
                : "absolute left-0 top-0 rounded-full pl-14"
            )}
            {...getInputProps({
              onChange: (event: ChangeEvent<HTMLInputElement>) => {
                if (onSearch) onSearch(event.target.value);
              },
            })}
          />
          {inputValue && (
            <Button
              className="group absolute right-2 top-2 flex size-8 items-center rounded-full hover:bg-bg-hover"
              onClick={() => {
                reset();
                selectItem(null);
                setInputValue("");
                openMenu();
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <XMarkIcon className="absolute right-1.5 size-5 text-zinc-500 group-hover:text-foreground" />
            </Button>
          )}
        </div>
      </div>
      <div className="absolute left-0 top-[54px] z-10 w-full">
        <ul
          {...getMenuProps({ ref: listRef })}
          className={cn(
            "relative max-h-60 max-w-full overflow-y-auto rounded-md border border-border bg-background text-sm shadow-floating",
            !(isOpen && items.length) && "hidden"
          )}
        >
          {loading ? (
            <li className="flex cursor-default select-none items-center gap-2 px-4 py-2 text-zinc-500">
              <Spinner loading={loading} /> {t("placeholder.loading")}
            </li>
          ) : items.length === 0 && inputValue !== "" ? (
            <li className="cursor-default select-none px-4 py-2 text-zinc-500">
              {t("placeholder.no_results")}
            </li>
          ) : items.length > 100 ? (
            <>
              <li
                key="total-size"
                style={{ height: rowVirtualizer.totalSize }}
              />
              {rowVirtualizer.virtualItems.map(virtualRow => (
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
                key={i}
                total={options.length}
                format={format}
                icon={icon}
                isSelected={selectedItem === items[i]}
                active={highlightedIndex === i}
                index={i}
                {...getItemProps({
                  index: i,
                  item: item,
                })}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ComboBox;
