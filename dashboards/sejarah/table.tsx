import { FaceFrownIcon } from "@heroicons/react/24/outline";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import BarPerc from "@charts/bar-perc";
import { PartyFlag, Spinner, Tooltip } from "@components/index";
import { cn, numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode } from "react";

export interface TableProps {
  className?: string;
  title?: string | ReactNode;
  empty?: string | ReactNode;
  data?: any;
  columns: Array<ColumnDef<any, any>>;
  highlightedRows?: Array<number>;
  isLoading: boolean;
}

type TableIds =
  | "index"
  | "party"
  | "election_name"
  | "name"
  | "votes"
  | "majority"
  | "seats"
  | "seat"
  | "result"
  | "full_result";

const Table: FunctionComponent<TableProps> = ({
  className = "",
  title,
  empty,
  data = dummyData,
  columns,
  highlightedRows = [-1],
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation(["common", "election", "party"]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /**
   * Special cells
   * keys: party | election | seats | result | votes | majority
   */
  const lookupDesktop = (id: TableIds, cell: any) => {
    const value = cell.getValue();
    switch (id) {
      case "index":
        return highlightedRows.includes(value - 1) ? (
          <p className="text-primary dark:text-primary-dark">{value}</p>
        ) : (
          value
        );
      case "name":
        return highlightedRows.includes(+cell.row.id) ? (
          <>
            <span className="pr-1">{value}</span>
            {/* <span className="inline-flex translate-y-0.5">
              <ResultBadge hidden value={cell.row.original.result} />
            </span> */}
          </>
        ) : (
          value
        );
      case "election_name":
        return (
          <div className="w-fit">
            <Tooltip
              tip={
                cell.row.original.date &&
                toDate(cell.row.original.date, "dd MMM yyyy", i18n.language)
              }
              className="max-xl:-left-3"
            >
              {(open) => (
                <div
                  className="cursor-help whitespace-nowrap underline decoration-dashed [text-underline-position:from-font]"
                  tabIndex={0}
                  onClick={open}
                >
                  {value === "By-Election"
                    ? t(value, { ns: "election" })
                    : value.slice(0, -5) +
                      t(value.slice(-5), { ns: "election" })}
                </div>
              )}
            </Tooltip>
          </div>
        );
      case "party":
        return <PartyFlag party={value} />;
      case "seats":
        return (
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <BarPerc hidden value={value.perc} />
            </div>
            <p className="whitespace-nowrap">{`${value.won} / ${value.total} ${
              value.perc !== null
                ? ` (${numFormat(value.perc, "compact", [1, 1])}%)`
                : " (—)"
            }`}</p>
          </div>
        );
      // case "result":
      //   return <ResultBadge value={value} />;

      case "votes":
      case "majority":
        return (
          <>
            {typeof value === "number" ? (
              value
            ) : (
              <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
                <div className="lg:self-center">
                  <BarPerc hidden value={value.perc} />
                </div>
                <span className="whitespace-nowrap">
                  {value.abs !== null ? numFormat(value.abs, "standard") : `—`}
                  {value.perc !== null
                    ? ` (${numFormat(value.perc, "compact", [1, 1])}%)`
                    : " (—)"}
                </span>
              </div>
            )}
          </>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };
  const lookupMobile = (id: TableIds, cell: any) => {
    if (!cell) return <></>;
    const value = cell.getValue();
    switch (id) {
      case "index":
        return highlightedRows.includes(value - 1) ? (
          <p className="text-primary dark:text-primary-dark font-bold">
            #{value}
          </p>
        ) : (
          <>#{value}</>
        );
      case "party":
        return (
          <PartyFlag party={value}>
            {(party) => cell.row.original.name ? (
              <span>
                <span className="pr-1 font-medium">
                  {cell.row.original.name}
                </span>
                <span className="inline-flex pr-1">{` (${party})`}</span>
                {/* <span className="inline-flex translate-y-0.5">
                  {highlightedRows.includes(+cell.row.id) && (
                    <ResultBadge hidden value={cell.row.original.result} />
                  )}
                </span> */}
              </span>
            ) : (
              <span className="font-medium">{t(party, { ns: "party" })}</span>
            )}
          </PartyFlag>
        );
      case "election_name":
        return (
          <div className="flex flex-wrap gap-x-3 text-sm">
            <p className="font-medium">
              {value === "By-Election"
                ? t(value, { ns: "election" })
                : value.slice(0, -5) + t(value.slice(-5), { ns: "election" })}
            </p>
            {cell.row.original.date && (
              <p className="text-zinc-500">
                {toDate(cell.row.original.date, "dd MMM yyyy", i18n.language)}
              </p>
            )}
          </div>
        );
      case "seats":
        return (
          <div className="flex flex-col space-y-1">
            <p className="text-zinc-500 font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            <div className="flex items-center gap-2">
              <BarPerc hidden value={value?.perc} />
              <p>
                {`${value?.won} / ${value?.total}
                 (${
                   value?.perc !== null
                     ? `${numFormat(value?.perc, "compact", [1, 1])}%`
                     : "(—)"
                 })`}
              </p>
            </div>
          </div>
        );
      case "votes":
        return (
          <div className="flex flex-col space-y-1">
            <p className="text-zinc-500 font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <BarPerc hidden value={value.perc} />
              <p>{`${
                value.abs !== null ? numFormat(value.abs, "standard") : "—"
              } (${
                value.perc !== null
                  ? `${numFormat(value.perc, "compact", [1, 1])}%`
                  : "—"
              })`}</p>
            </div>
          </div>
        );
      // case "majority":
      //   return (
      //     <div className="flex flex-row gap-2">
      //       <p className="text-zinc-500 font-medium">
      //         {flexRender(cell.column.columnDef.header, cell.getContext())}
      //       </p>
      //       {typeof value === "number" ? (
      //         <p className="font-bold">{value}</p>
      //       ) : (
      //         <div className="flex items-center gap-2">
      //           <BarPerc hidden value={value.perc} />
      //           <p>{`${
      //             value.abs !== null ? numFormat(value.abs, "standard") : "—"
      //           } (${
      //             value.perc !== null
      //               ? `${numFormat(value.perc, "compact", [1, 1])}%`
      //               : "—"
      //           })`}</p>
      //         </div>
      //       )}
      //     </div>
      //   );
      // case "result":
      //   return (
      //     <div className="flex flex-col space-y-1">
      //       <p className="text-zinc-500 font-medium">
      //         {flexRender(cell.column.columnDef.header, cell.getContext())}
      //       </p>
      //       <ResultBadge value={value} />
      //     </div>
      //   );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  return (
    <>
      <div>
        {title && typeof title === "string" ? (
          <span className="pb-6 text-base font-bold dark:text-white">
            {title}
          </span>
        ) : (
          title
        )}
      </div>
      <div className={cn("relative", className)}>
        {/* Desktop */}
        <table className="hidden w-full text-left text-sm md:table">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-slate-200 dark:border-zinc-800 whitespace-nowrap border-b-2 px-2 py-[10px] font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            <></>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row: any, rowIndex: number) => (
                <tr
                  key={row.id}
                  className={cn(
                    highlightedRows.includes(rowIndex)
                      ? "bg-slate-50 dark:bg-zinc-950"
                      : "bg-inherit",
                    "border-slate-200 dark:border-zinc-800 border-b"
                  )}
                >
                  {row.getVisibleCells().map((cell: any, colIndex: number) => (
                    <td
                      key={cell.id}
                      className={cn(
                        highlightedRows.includes(rowIndex) && colIndex === 0
                          ? "font-medium"
                          : "font-normal",
                        "px-2 py-[10px]"
                      )}
                    >
                      {lookupDesktop(cell.column.columnDef.id, cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Mobile */}
        {table.getRowModel().rows.map((row: any, index: number) => {
          const ids = table.getAllColumns().map((col) => col.id);
          let _row: Record<string, ReactNode> = {};
          row.getVisibleCells().forEach((cell: any) => {
            _row[cell.column.columnDef.id] = lookupMobile(
              cell.column.columnDef.id,
              cell
            );
          });
          return isLoading ? (
            <></>
          ) : (
            <div
              className={cn(
                "border-slate-200 dark:border-zinc-800 flex flex-col space-y-2 border-b p-3 text-sm first:border-t-2 md:hidden",
                index === 0 && "border-t-2",
                highlightedRows.includes(index)
                  ? "bg-slate-50 dark:bg-[#121212]"
                  : "bg-inherit"
              )}
              key={index}
            >
              {/* Row 1 - Election Name / Date */}
              {["election_name"].some((id) => ids.includes(id)) && (
                <div className="flex items-start justify-between gap-x-2">
                  <div className="flex gap-x-2">
                    {_row.index}
                    {_row.election_name}
                  </div>
                </div>
              )}
              {/* Row 2 - Seat (if available)*/}
              {(_row.seat || _row.index) && (
                <div>
                  <p>{_row.seat} </p>
                </div>
              )}
              {/* Row 3 - Party */}
              {_row.party && <div>{_row.party}</div>}

              {/* Row 4 - Result *Depends on page shown */}
              {/* {_row.name && ( // SEATS
                <div className="flex flex-row gap-2">
                  {_row.majority}
                  {_row.votes}
                </div>
              )} */}
              {_row.result && ( // CANDIDATES
                <div className="flex flex-row space-x-4">
                  {_row.votes}
                  {_row.result}
                </div>
              )}
              {_row.seats && ( // PARTIES
                <div className="flex flex-row space-x-3">
                  {_row.seats}
                  {_row.votes}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex h-[200px] w-full items-center justify-center">
            <Spinner loading={isLoading} />
          </div>
        )}
        {!data.length && !isLoading && (
          <div className="flex items-center justify-center h-[200px]">
            <div className="bg-slate-200 dark:bg-zinc-800 flex h-auto w-[300px] rounded-md px-3 pb-2 pt-1 lg:w-fit">
              <p className="text-sm">
                <span className="inline-flex pr-1">
                  <FaceFrownIcon className="h-5 w-5 translate-y-1" />
                </span>
                {empty}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;

const dummyData = [
  {
    name: "Rushdan Bin Rusmi",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "PN",
  },
  {
    name: "Zahidi Bin Zainul Abidin",
    date: "2022-11-19",
    election_name: "GE-14",
    seat: "P.001 Padang Besar, Perlis",
    party: "BN",
  },
  {
    name: "Zahidi Bin Zainul Abidin",
    date: "2022-11-19",
    election_name: "GE-13",
    seat: "P.001 Padang Besar, Perlis",
    party: "BEBAS",
  },
  {
    name: "Azmi Bin Khalid",
    date: "2022-11-19",
    election_name: "GE-12",
    seat: "P.001 Padang Besar, Perlis",
    party: "BN",
  },
  {
    name: "Azmi Bin Khalid",
    date: "2022-11-19",
    election_name: "GE-11",
    seat: "P.001 Padang Besar, Perlis",
    party: "PH",
  },
  {
    name: "Azmi Bin Khalid",
    date: "2022-11-19",
    election_name: "GE-10",
    seat: "P.001 Padang Besar, Perlis",
    party: "PH",
  },
  {
    name: "Azmi Bin Khalid",
    date: "2022-11-19",
    election_name: "GE-09",
    seat: "P.001 Padang Besar, Perlis",
    party: "PH",
  },
];
