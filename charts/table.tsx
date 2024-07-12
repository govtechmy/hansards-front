import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  Dispatch,
  SetStateAction,
  useCallback,
  ReactNode,
} from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  FilterFn,
  getFilteredRowModel,
  SortDirection,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CountryAndStates } from "@lib/constants";
import Image from "next/image";
import { useTranslation } from "@hooks/useTranslation";
import { default as debounce } from "lodash/debounce";
import { DebouncedFunc } from "lodash";
import { cn, numFormat } from "@lib/helpers";
import Button from "@components/Button";
import { Precision } from "@lib/types";

export interface TableConfigColumn {
  id: string;
  header?: string;
  accessorKey?: string;
}

export interface TableConfig {
  id?: string | undefined;
  header?: ReactNode;
  accessorKey?: string;
  className?: string;
  enableSorting?: boolean;
  cell?: (item: any) => JSX.Element;
  columns?: TableConfigColumn[];
  accessorFn?: ({ value }: any) => string;
  sortingFn?: string;
  sortDescFirst?: boolean;
}

export interface TableProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
  freeze?: string[];
  controls?: (
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>
  ) => ReactNode;
  search?: (
    setGlobalFilter: DebouncedFunc<(query: string) => void>
  ) => ReactNode;
  sorts?: SortingState;
  cellClass?: string;
  data?: any;
  config?: Array<TableConfig>;
  responsive?: Boolean;
  enablePagination?: false | number;
  precision?: number | Precision;
  stripe?: boolean;
  "data-testid"?: string;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const search = value.toLowerCase();
  let compareTo = row.getValue(columnId) as string;
  // Rank the item
  const itemRank = rankItem(compareTo, search);

  // Store the itemRank info
  addMeta({ itemRank });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const Table: FunctionComponent<TableProps> = ({
  className = "",
  title,
  menu,
  data = dummy,
  config = dummyConfig,
  sorts = [],
  freeze,
  controls,
  search,
  responsive = true,
  enablePagination = false,
  cellClass,
  precision,
  stripe = false,
  ...props
}) => {
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => config as any,
    [config]
  );
  const [sorting, setSorting] = useState<SortingState>(sorts);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

  const sortTooltip = (sortDir: SortDirection | false) => {
    if (sortDir === false) return t("sort");
    else if (sortDir === "desc") return t("desc_order");
    else if (sortDir === "asc") return t("asc_order");
    return undefined;
  };
  const ReactTableProps: any = {
    data,
    columns,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      globalFilter: globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    debugTable: false,
  };

  const table = useReactTable(ReactTableProps);

  useEffect(() => {
    if (enablePagination) table.setPageSize(enablePagination);
  }, [enablePagination]);

  const onSearch = useCallback(
    debounce((query: string) => {
      setGlobalFilter(query ?? "");
    }, 500),
    []
  );

  const calcStickyLeft = (cellId: string) => {
    // FIXME: clientWidth is not the exact width that ends up rendered
    const ele = document.getElementById(cellId)?.previousElementSibling;
    return ele !== undefined && ele !== null ? ele.clientWidth : 0;
  };

  const styles = {
    page: "px-3 py-1.5 rounded-md",
    inactive: "hover:bg-slate-100 dark:bg-zinc-800",
    active: "bg-slate-200 dark:bg-zinc-800",
  };

  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const DOTS = "...";
  const curr = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const siblings = 1; // square(s) beside curr
  const pageRange = useMemo(() => {
    // If num of pages < the squares we want to show, return the range [1..totalPages]
    if (totalPages <= 5 + siblings) {
      return range(1, totalPages);
    }

    const leftSiblingIdx = Math.max(curr + 1 - siblings, 1);
    const rightSiblingIdx = Math.min(curr + 1 + siblings, totalPages);

    const shouldShowLeftDots = leftSiblingIdx > 2;
    const shouldShowRightDots = rightSiblingIdx < totalPages - 2;

    const firstPageIdx = 1;
    const lastPageIdx = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblings;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblings;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIdx, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIdx, rightSiblingIdx);
      return [firstPageIdx, DOTS, ...middleRange, DOTS, lastPageIdx];
    }
  }, [curr, totalPages]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <span className="text-base font-bold">{title}</span>
        {menu && (
          <div className="flex items-center justify-end gap-2">{menu}</div>
        )}
      </div>

      {(search || controls) && (
        <div className="flex w-full flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
            {controls && controls(setColumnFilters)}
          </div>
          {search && search(onSearch)}
        </div>
      )}
      <div className={cn(responsive && "relative overflow-x-auto")}>
        <table
          className={cn(
            "relative mx-auto w-full table-auto border-separate border-spacing-0 whitespace-nowrap",
            className
          )}
          data-testid={props["data-testid"]}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <th
                      key={header.id}
                      id={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        freeze?.includes(header.id) &&
                        "sticky z-10 bg-inherit max-lg:border-r-2",
                        "border-border border-b-2 py-[10px] font-medium"
                      )}
                      style={{
                        left: freeze?.includes(header.id)
                          ? calcStickyLeft(header.id)
                          : 0,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.subHeaders.length < 1
                              ? "flex select-none items-center justify-between gap-1 text-left text-sm"
                              : !header.column.columnDef.header
                                ? "hidden"
                                : "pr-2 text-end",
                            header.column.getCanSort() ? "cursor-pointer" : ""
                          )}
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </p>
                            {header.column.columnDef?.subheader && (
                              <p className="text-zinc-500 text-left dark:text-white">
                                {header.column.columnDef?.subheader}
                              </p>
                            )}
                          </div>
                          {header.subHeaders.length < 1 && (
                            <span
                              className="ml-1 inline-block"
                              title={sortTooltip(header.column.getIsSorted())}
                            >
                              {
                                {
                                  asc: (
                                    <UpDownIcon
                                      className="h-5 w-5 text-zinc-900 dark:text-white"
                                      transform="down"
                                    />
                                  ),
                                  desc: (
                                    <UpDownIcon
                                      className="h-5 w-5 text-zinc-900 dark:text-white"
                                      transform="up"
                                    />
                                  ),
                                }[header.column.getIsSorted() as SortDirection]
                              }
                              {header.column.getCanSort() &&
                                !header.column.getIsSorted() && (
                                  <UpDownIcon className="-m-1 h-5 w-5 text-zinc-900 dark:text-white" />
                                )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      stripe
                        ? "even:bg-slate-50 even:dark:bg-zinc-800 odd:bg-white odd:dark:bg-zinc-900"
                        : "bg-white dark:bg-zinc-900"
                    )}
                  >
                    {row.getVisibleCells().map((cell: any) => {
                      const value = cell.getValue();
                      const unit = cell.column.columnDef.unit ?? undefined;

                      const getPrecision = (
                        precision?: number | Precision
                      ): number | [number, number] => {
                        if (!precision) return [1, 0];
                        else if (typeof precision === "number")
                          return precision;
                        else if (
                          precision.columns &&
                          cell.column.id in precision.columns
                        )
                          return precision.columns[cell.column.id];
                        else return precision.default;
                      };

                      const classNames = cn(
                        "border-slate-200 dark:border-zinc-800 border-b px-2 py-2.5 max-sm:max-w-[150px] truncate",
                        typeof value === "number" && "tabular-nums text-right",
                        freeze?.includes(cell.column.id) &&
                        "sticky z-10 bg-inherit max-lg:border-r-2",
                        cell.column.columnDef.className
                          ? cell.column.columnDef.className
                          : cellClass
                      );

                      const displayValue = () => {
                        if (cell.column.columnDef.cell)
                          return flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          );
                        if (typeof value === "number")
                          return numFormat(
                            value,
                            "standard",
                            getPrecision(precision)
                          );
                        if (value === "NaN") return "-";
                        return flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        );
                      };
                      return (
                        <td
                          id={cell.id}
                          key={cell.id}
                          className={classNames}
                          style={{
                            left: freeze?.includes(cell.column.id)
                              ? calcStickyLeft(cell.column.id)
                              : 0,
                          }}
                        >
                          {displayValue()}
                          {value !== null ? unit : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <div className="h-20 flex justify-center items-center">{t("no_entries")}. </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {enablePagination && (
        <div className="mt-5 flex items-center justify-center gap-4 text-sm font-medium">
          <Button
            className="btn-disabled btn-default"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4.5 w-4.5" />
            <p className="max-sm:hidden">{t("previous")}</p>
          </Button>
          <div className="max-[480px]:hidden flex gap-1.5 items-center text-inherit">
            {pageRange?.map((page, i) => {
              return typeof page === "number" ? (
                <button
                  key={page + i}
                  className={cn(
                    styles.page,
                    curr === page - 1 ? styles.active : styles.inactive
                  )}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </button>
              ) : (
                <div key={page + i} className={cn(styles.page)}>{page}</div>
              );
            })}
          </div>
          <span className="max-[480px]:flex items-center gap-1 text-center hidden">
            {t("page_of", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </span>
          <Button
            className="btn-disabled btn-default"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <p className="max-sm:hidden">{t("next")}</p>
            <ChevronRightIcon className="h-4.5 w-4.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

//
const dummyConfig: TableConfig[] = [
  {
    header: "",
    id: "state",
    accessorKey: "state",
    enableSorting: false,
    cell: (item: any) => {
      const state = item.getValue() as string;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={`/static/images/states/${state}.jpeg`}
            width={28}
            height={16}
            alt={CountryAndStates[state]}
          />
          <span>{CountryAndStates[state]}</span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    columns: [
      {
        id: "total.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "total.perc_1dose.child",
      },
      {
        id: "total.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "total.perc_2dose",
      },
      {
        id: "perc_1booster",
        header: "% 1 Booster",
        accessorKey: "total.perc_1booster",
      },
    ],
  },
  {
    id: "adult",
    header: "Adults",
    columns: [
      {
        id: "adult.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "adult.perc_1dose",
      },
      {
        id: "adult.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "adult.perc_2dose",
      },
      {
        id: "adult.perc_1booster",
        header: "% 1 Booster",
        accessorKey: "adult.perc_1booster",
      },
    ],
  },
];

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    const state = Object.keys(CountryAndStates)[index];
    return {
      id: index, //
      state: state, // state code: sgr, mlk etc
      total: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adult: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
    };
  });

export default Table;

interface IconProps {
  className?: string;
  transform?: string;
}

const UpDownIcon: FunctionComponent<IconProps> = ({
  className,
  transform,
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="UpDownIcon">
        <path
          id="Up"
          d="M6.48939 11.0468C6.39703 11.081 6.31232 11.1331 6.24009 11.2001C6.16786 11.2671 6.10952 11.3476 6.06842 11.4371C6.02732 11.5266 6.00425 11.6234 6.00053 11.7218C5.99682 11.8202 6.01253 11.9184 6.04677 12.0108C6.08101 12.1032 6.13311 12.1879 6.20009 12.2601L9.45009 15.7601C9.5203 15.8358 9.60539 15.8962 9.70003 15.9376C9.79467 15.9789 9.89683 16.0002 10.0001 16.0002C10.1034 16.0002 10.2055 15.9789 10.3002 15.9376C10.3948 15.8962 10.4799 15.8358 10.5501 15.7601L13.8001 12.2601C13.9354 12.1142 14.0071 11.9206 13.9996 11.7218C13.9921 11.523 13.906 11.3354 13.7601 11.2001C13.6142 11.0648 13.4206 10.9931 13.2218 11.0006L6.77838 11.0005C6.77838 11.0005 6.58175 11.0125 6.48939 11.0468Z"
          fill={transform === "up" ? "currentColor" : "#94A3B8"}
        />
        <path
          id="Down"
          d="M10.3001 4.0626C10.2055 4.0213 10.1033 3.99999 10.0001 4C9.89681 3.99999 9.79466 4.0213 9.70002 4.0626C9.60538 4.10389 9.52028 4.16429 9.45007 4.24L6.20007 7.74C6.06481 7.88587 5.99303 8.0795 6.00053 8.27828C6.00804 8.47707 6.0942 8.66474 6.24007 8.8C6.38594 8.93526 6.57956 9.00703 6.77835 8.99953H13.2218C13.3202 9.00325 13.4184 8.98754 13.5108 8.9533C13.6031 8.91907 13.6878 8.86697 13.7601 8.8C13.8323 8.73303 13.8906 8.65248 13.9317 8.56297C13.9728 8.47345 13.9959 8.37671 13.9996 8.27828C14.0033 8.17985 13.9876 8.08166 13.9534 7.9893C13.9191 7.89694 13.867 7.81223 13.8001 7.74L10.5501 4.24C10.4799 4.16429 10.3948 4.10389 10.3001 4.0626Z"
          fill={transform === "down" ? "currentColor" : "#94A3B8"}
        />
      </g>
    </svg>
  );
};
