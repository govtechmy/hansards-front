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
console.log(selectedItem)
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
            ) : (
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
                  // <li
                  //   key={items[virtualRow.index].value}
                  //   {...getItemProps({
                  //     index: virtualRow.index,
                  //     item: items[virtualRow.index],
                  //     style: {
                  //       backgroundColor:
                  //         highlightedIndex === virtualRow.index
                  //           ? "lightgray"
                  //           : "inherit",
                  //       fontWeight: selectedItem ? "bold" : "normal",
                  //       height: virtualRow.size,
                  //       transform: `translateY(${virtualRow.start}px)`,
                  //     },
                  //   })}
                  //   className="px-4 py-2 absolute top-0 left-0 w-full"
                  // >
                  //   {items[virtualRow.index].label}
                  // </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
    // <div
    //   ref={refs.setReference}
    //   onClick={() => setOpen(!open)}
    //   className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 shadow-button relative flex w-full select-none overflow-hidden rounded-full border focus:outline-none focus-visible:ring-0"
    // >
    //   <span className="ml-4 flex h-auto max-h-8 w-8 shrink-0 justify-center self-center">
    //     {image && selected ? (
    //       image(selected.value)
    //     ) : (
    //       <MagnifyingGlassIcon className="dark:text-zinc-500 h-5 w-5 text-zinc-900" />
    //     )}
    //   </span>
    //   <input
    //     className={cn(
    //       "w-full truncate border-none bg-white py-3 pl-2 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-zinc-900"
    //     )}
    //     spellCheck={false}
    //     {...getReferenceProps({
    //       onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    //         const value = event.target.value;
    //         setQuery(value);
    //         if (onSearch) onSearch(value);
    //         if (rowVirtualizer.getVirtualItems().length !== 0)
    //           rowVirtualizer.scrollToIndex(0);

    //         if (value) {
    //           setOpen(true);
    //           setActiveIndex(0);
    //         } else {
    //           onChange(undefined);
    //           setOpen(false);
    //         }
    //       },
    //       value: query,
    //       placeholder: placeholder,
    //       "aria-autocomplete": "list",
    //       onKeyDown(event) {
    //         if (
    //           event.key === "Enter" &&
    //           activeIndex != null &&
    //           filteredOptions[activeIndex]
    //         ) {
    //           onChange(filteredOptions[activeIndex]);
    //           setQuery(filteredOptions[activeIndex].label);
    //           setActiveIndex(null);
    //           setOpen(false);
    //         }
    //       },
    //     })}
    //   />

    //   {(query.length > 0 || selected) && (
    //     <Button
    //       className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
    //       onClick={() => {
    //         setQuery("");
    //         setOpen(true);
    //         onChange(undefined);
    //         setActiveIndex(null);
    //         (refs.reference.current as HTMLInputElement).focus();
    //       }}
    //     >
    //       <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
    //     </Button>
    //   )}
    //   {open && (
    //     <FloatingPortal>
    //       <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
    //         <div
    //           className={cn(
    //             body.variable,
    //             "font-body border-slate-200 dark:border-zinc-800 shadow-floating absolute z-20 max-h-60 w-full overflow-auto rounded-md border bg-white text-sm focus:outline-none dark:bg-zinc-900"
    //           )}
    //           ref={refs.setFloating}
    //           tabIndex={-1}
    //           style={{
    //             ...floatingStyles,
    //             maxHeight,
    //           }}
    //         >
    //           {filteredOptions.length <= 150 ? (
    //             <>
    //               {loading ? (
    //                 <div className="text-zinc-500 flex cursor-default select-none items-center gap-2 px-4 py-2">
    //                   <Spinner loading={loading} />{" "}
    //                   {t("placeholder.loading")}
    //                 </div>
    //               ) : filteredOptions.length === 0 && query !== "" ? (
    //                 <p className="text-zinc-500 cursor-default select-none px-4 py-2">
    //                   {t("placeholder.no_results")}
    //                 </p>
    //               ) : (
    //                 filteredOptions.map((option, i) => {
    //                   return (
    //                     <ComboOption<T>
    //                       {...getItemProps({
    //                         key: i,
    //                         ref(node) {
    //                           listRef.current[i] = node;
    //                         },
    //                         onClick() {
    //                           onChange(option);
    //                           setQuery(option.label);
    //                           setActiveIndex(null);
    //                           setOpen(false);
    //                           refs.domReference.current?.focus();
    //                         },
    //                       })}
    //                       total={ITEMS_COUNT}
    //                       option={option}
    //                       format={format}
    //                       image={image}
    //                       isSelected={selected?.value === option.value}
    //                       active={i === activeIndex}
    //                       index={i}
    //                     />
    //                   );
    //                 })
    //               )}
    //             </>
    //           ) : (
    //             <div
    //               className="relative w-full outline-none"
    //               style={{
    //                 height: rowVirtualizer.getTotalSize(),
    //               }}
    //               // Some screen readers do not like any wrapper tags inside
    //               // of the element with the role, so we spread it onto the
    //               // virtualizer wrapper.
    //               {...getFloatingProps({
    //                 onKeyDown(e) {
    //                   if (
    //                     e.key === "Enter" &&
    //                     activeIndex != null &&
    //                     filteredOptions[activeIndex]
    //                   ) {
    //                     onChange(filteredOptions[activeIndex]);
    //                     setQuery(filteredOptions[activeIndex].label);
    //                     setActiveIndex(null);
    //                     setOpen(false);
    //                   }
    //                 },
    //               })}
    //               // Ensure this element receives focus upon open so keydowning works.
    //               tabIndex={0}
    //             >
    //               <div
    //                 style={{
    //                   position: "absolute",
    //                   top: 0,
    //                   left: 0,
    //                   width: "100%",
    //                   transform: `translateY(${
    //                     rowVirtualizer.getVirtualItems()[0].start
    //                   }px)`,
    //                 }}
    //               >
    //                 {rowVirtualizer
    //                   .getVirtualItems()
    //                   .map((virtualItem: any) => {
    //                     const option = filteredOptions[virtualItem.index];
    //                     return (
    //                       <ComboOption
    //                         {...getItemProps({
    //                           key: virtualItem.index,
    //                           ref(node) {
    //                             listRef.current[virtualItem.index] = node;
    //                           },
    //                           onClick() {
    //                             onChange(option);
    //                             setQuery(option.label);
    //                             setActiveIndex(null);
    //                             setOpen(false);
    //                             refs.domReference.current?.focus();
    //                           },
    //                         })}
    //                         total={ITEMS_COUNT}
    //                         option={option}
    //                         format={format}
    //                         image={image}
    //                         isSelected={selected?.value === option.value}
    //                         active={virtualItem.index === activeIndex}
    //                         index={virtualItem.index}
    //                       />
    //                     );
    //                   })}
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       </FloatingFocusManager>
    //     </FloatingPortal>
    //   )}
    // </div>
  );
};

export default ComboBox;
