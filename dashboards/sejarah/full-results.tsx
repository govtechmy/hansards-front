import ResultBadge from "./result-badge";
import Table from "./table";
import type {
  BaseResult,
  Individu,
  Parti,
  PartiResult,
  Kawasan,
  ElectionResult,
} from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@components/Dialog";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
} from "@components/Drawer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import BarPerc from "@charts/bar-perc";
import Button from "@components/Button";
import { useData } from "@hooks/useData";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { cn, numFormat, toDate } from "@lib/helpers";
import { useEffect, useState } from "react";

export type Result<T> = {
  data: T;
  votes?: Array<{
    x: string;
    abs: number;
    perc: number;
  }>;
};

interface FullResultsProps<T extends Individu | Parti | Kawasan> {
  onChange: (option: T) => Promise<Result<BaseResult[] | PartiResult>>;
  options: Array<T>;
  columns?: any;
  highlighted?: string;
  currentIndex: number;
}

const FullResults = <T extends Individu | Parti | Kawasan>({
  onChange,
  options,
  columns,
  highlighted,
  currentIndex,
}: FullResultsProps<T>) => {
  if (!options) return <></>;

  const { t, i18n } = useTranslation("sejarah");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState<boolean>(false);
  const { data, setData } = useData({
    index: currentIndex,
    area: "",
    badge: "" as ElectionResult,
    date: "",
    election_name: "",
    state: "",
    results: {} as Result<BaseResult[] | PartiResult>,
    loading: true,
  });

  useEffect(() => setData("index", currentIndex), [open]);

  const selected = options[currentIndex];
  const isIndividu = typeof selected === "object" && "result" in selected;
  const isParti =
    typeof selected === "object" && "seats" in selected && "state" in selected;

  const getData = (obj: Individu | Parti | Kawasan) => {
    setData("date", toDate(obj.date, "dd MMM yyyy", i18n.language));
    setData("election_name", obj.election_name.slice(-5));
    if ("seat" in obj) {
      const matches = obj.seat.split(",");
      setData("area", matches[0]);
      setData("state", matches[1]);
    }
    if ("result" in obj) {
      setData("badge", obj.result);
    }
  };

  const ElectionResults = () => (
    <div className="h-[calc(100%-80px)] space-y-6 text-base max-md:overflow-y-scroll max-md:px-4 max-md:pb-4">
      <div className="space-y-3">
        <div className="font-bold">{t("election_result")}</div>
        <Table
          className="w-full md:max-h-96 md:overflow-y-auto"
          data={data.results.data}
          columns={columns}
          isLoading={data.loading}
          highlighted={highlighted}
          result={isIndividu ? selected.result : undefined}
        />
      </div>

      {data.results.votes && (
        <div className="space-y-3">
          <div className="font-bold">{t("voting_statistics")}</div>
          <div className="flex flex-col gap-3 text-sm lg:flex-row lg:gap-x-6">
            {data.results.votes.map(
              (item: { x: string; abs: number; perc: number }) => (
                <div
                  className="flex flex-wrap gap-3 whitespace-nowrap"
                  key={item.x}
                >
                  <p className="w-28 md:w-fit">{t(item.x)}:</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <BarPerc hidden value={item.perc} size="h-[5px] w-[50px]" />
                    <p>{`${
                      item.abs !== null ? numFormat(item.abs, "standard") : "—"
                    } ${
                      item.perc !== null
                        ? `(${numFormat(item.perc, "compact", 1)}%)`
                        : "(—)"
                    }`}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  const Pagination = () => {
    if (options.length > 1)
      return (
        <div className="space-y-3">
          {options && options?.length <= 10 && (
            <div className="flex flex-row items-center justify-center gap-1.5">
              {options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setData("loading", true);
                    onChange(option).then(results => {
                      if (!results) return;
                      setData("index", index);
                      setData("results", results);
                      getData(options[index]);
                    });
                    setData("loading", false);
                  }}
                  disabled={index === data.index}
                  className={cn(
                    "h-1 w-5 rounded-md",
                    index === data.index
                      ? "bg-foreground"
                      : "bg-slate-200 hover:bg-bg-hover dark:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <Button
              variant="outline"
              className="btn-disabled"
              onClick={() => {
                setData("loading", true);
                onChange(options[data.index - 1]).then(results => {
                  if (!results) return;
                  setData("index", data.index - 1);
                  getData(options[data.index - 1]);
                  setData("results", results);
                });
                setData("loading", false);
              }}
              disabled={data.index === 0}
            >
              <ChevronLeftIcon className="h-4.5 w-4.5" />
              {t("previous", { ns: "common" })}
            </Button>
            {options.length > 10 && (
              <span className="flex items-center gap-1 text-center text-sm">
                {`${data.index + 1} / ${options.length}`}
              </span>
            )}
            <Button
              variant="outline"
              className="btn-disabled"
              onClick={() => {
                setData("loading", true);
                onChange(options[data.index + 1]).then(results => {
                  if (!results) return;
                  setData("index", data.index + 1);
                  setData("results", results);
                  getData(options[data.index + 1]);
                });
                setData("loading", false);
              }}
              disabled={data.index === options.length - 1}
            >
              {t("next", { ns: "common" })}
              <ChevronRightIcon className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      );
    return <></>;
  };

  const FullResultsButton = () => (
    <Button
      variant="reset"
      className="btn text-zinc-500 hover:text-foreground"
      onClick={() => {
        setData("loading", true);
        setOpen(true);
        getData(options[data.index]);
        onChange(selected).then(results => {
          if (!results) return;
          setData("results", results);
          setData("loading", false);
        });
      }}
    >
      <ArrowsPointingOutIcon className="h-4.5 w-4.5" />
      <p className="whitespace-nowrap font-normal">{t("full_result")}</p>
    </Button>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <FullResultsButton />
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="pr-8 uppercase">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-wrap gap-x-2 text-lg">
                <h3 className="title">
                  {isParti
                    ? t(data.election_name, { ns: "election" })
                    : data.area}
                </h3>
                <span className="text-zinc-500">
                  {isParti ? data.date : data.state}
                </span>
              </div>
              {isIndividu && <ResultBadge value={data.badge} />}
            </div>
            <div className="space-x-3">
              {!isParti && (
                <div className="flex flex-wrap gap-x-2">
                  <span>{t(data.election_name, { ns: "election" })}</span>
                  <span className="text-zinc-500">{data.date}</span>
                </div>
              )}
            </div>
          </DialogHeader>
          <ElectionResults />
          <Pagination />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <FullResultsButton />
      </DrawerTrigger>
      <DrawerContent className="max-h-[calc(100%-96px)] pt-0">
        <DrawerHeader className="flex w-full flex-col items-start px-4 py-3 uppercase">
          <div className="flex w-full justify-between">
            <div className="flex flex-wrap gap-x-2 text-lg">
              <h3 className="title">
                {isParti
                  ? t(data.election_name, { ns: "election" })
                  : data.area}
              </h3>
              <span className="text-zinc-500">
                {isParti ? data.date : data.state}
              </span>
            </div>
            <DrawerClose>
              <XMarkIcon className="h-5 w-5" />
            </DrawerClose>
          </div>
          {!isParti && (
            <div className="flex flex-wrap gap-x-2">
              <span>{t(data.election_name, { ns: "election" })}</span>
              <span className="text-zinc-500">{data.date}</span>
            </div>
          )}
          {isIndividu && <ResultBadge value={data.badge} />}
        </DrawerHeader>
        <ElectionResults />
        <DrawerFooter>
          <Pagination />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FullResults;
