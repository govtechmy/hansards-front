import BarPerc from "@charts/bar-perc";
import PartyFlag from "@components/PartyFlag";
import Search from "@components/Search";
import Skeleton from "@components/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import { FlagIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn, numFormat } from "@lib/helpers";
import dynamic from "next/dynamic";
import { useState } from "react";

/**
 * Kehadiran - Table
 * @overview Status: In-development
 */

const Table = dynamic(() => import("@charts/table"), {
  loading: () => <Skeleton height="h-[550px]" width="w-auto" />,
  ssr: false,
});

type Kehadiran = {
  party: string;
  total_attended: number;
  attendance_pct: number;
  total: number;
};
type Individual = Kehadiran & {
  rank: number;
  name: string;
  area: string;
  age: number;
  age_group: string;
  gender: string;
  ethnicity: string;
};
type Party = Kehadiran & {
  total_seats: number;
};

export interface KehadiranTableProps {
  loading: boolean;
  individual: Individual[];
  party: Party[];
}

const KehadiranTable = ({
  individual,
  loading,
  party,
}: KehadiranTableProps) => {
  const { t } = useTranslation(["kehadiran", "demografi"]);
  const [tab, setTab] = useState<string>("ind");

  const kehadiranPerc = (value: Kehadiran) => (
    <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
      <div>
        <BarPerc hidden value={value.attendance_pct} />
      </div>
      <p className="whitespace-nowrap">{`${value.total_attended} / ${
        value.total
      } ${
        value.attendance_pct !== null
          ? ` (${numFormat(value.attendance_pct, "compact", 1)}%)`
          : " (—)"
      }`}</p>
    </div>
  );

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={index => setTab(index)}
        defaultValue="ind"
        className="pt-6 lg:pt-12"
      >
        <TabsList className="flex h-full flex-wrap items-end justify-between gap-3 pb-3">
          <h3 className="title">
            {t("kehadiran", {
              context: tab,
            })}
          </h3>
          <div>
            <TabsTrigger
              value="ind"
              className={cn(
                tab === "ind" ? "text-foreground" : "text-zinc-500"
              )}
              icon={<UserIcon className="mr-1 size-5" />}
            >
              {t("common:individu")}
            </TabsTrigger>
            <TabsTrigger
              value="parti"
              className={cn(
                tab === "parti" ? "text-foreground" : "text-zinc-500"
              )}
              icon={<FlagIcon key="map_icon" className="mr-1 size-5" />}
            >
              {t("common:party")}
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="ind">
          {loading ? (
            <Skeleton height="h-[550px]" width="w-auto" />
          ) : (
            <Table
              className="text-sm"
              config={[
                {
                  accessorKey: "rank",
                  header: "#",
                  className: "text-left",
                },
                {
                  accessorKey: "attendance_pct",
                  header: t("kehadiran"),
                  className: "min-w-[180px]",
                  cell: ({ row }) => kehadiranPerc(row.original),
                },
                {
                  accessorFn: row => `[${row.area}] ${row.name}`,
                  id: "name",
                  header: t("name"),
                  className: "truncate min-w-[320px] max-w-[360px]",
                },
                {
                  accessorKey: "party",
                  header: t("party", { ns: "common" }),
                  className: "min-w-[240px] max-w-[240px]",
                  cell: ({ getValue }) => <PartyFlag party={getValue()} />,
                },
                {
                  accessorKey: "age",
                  header: t("age", { ns: "demografi" }),
                  className: "text-left",
                },
                {
                  accessorKey: "gender",
                  header: t("gender", { ns: "demografi" }),
                  cell: ({ getValue }) => (
                    <>{t(getValue(), { ns: "demografi" })}</>
                  ),
                },
                {
                  accessorKey: "ethnicity",
                  header: t("ethnicity", { ns: "demografi" }),
                  className: "min-w-[160px]",
                  cell: ({ getValue }) => (
                    <>{t(getValue(), { ns: "demografi" })}</>
                  ),
                },
              ]}
              search={onSearch => (
                <Search
                  className="w-full border-b lg:w-[300px]"
                  onChange={event => onSearch(event.target.value ?? "")}
                />
              )}
              data={individual}
              enablePagination={10}
            />
          )}
        </TabsContent>
        <TabsContent value="parti">
          {loading ? (
            <Skeleton height="h-[300px]" width="w-auto" />
          ) : (
            <Table
              className="text-sm"
              config={[
                {
                  accessorKey: "party",
                  header: t("party", { ns: "common" }),
                  className: "min-w-[240px] max-w-[300px]",
                  cell: ({ getValue }) => <PartyFlag party={getValue()} />,
                },
                {
                  accessorKey: "attendance_pct",
                  header: t("kehadiran"),
                  className: "min-w-[180px]",
                  cell: ({ row }) => kehadiranPerc(row.original),
                },
                {
                  accessorKey: "total_seats",
                  header: t("total_seats"),
                  className: "w-[150px]",
                },
              ]}
              search={onSearch => (
                <Search
                  className="w-full border-b lg:w-[300px]"
                  onChange={event => onSearch(event.target.value ?? "")}
                />
              )}
              data={party}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default KehadiranTable;
