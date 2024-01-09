import ResultBadge from "./result-badge";
import Table from "./table";
import type {
  BaseResult,
  Individu,
  Parti,
  PartiResult,
  Kawasan,
} from "./types";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "@components/Dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import BarPerc from "@charts/bar-perc";
import Button from "@components/Button";
import { cn, numFormat, slugify, toDate } from "@lib/helpers";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useState } from "react";

export type Result<T> = {
  data: T;
  votes?: Array<{
    x: string;
    abs: number;
    perc: number;
  }>;
} | void;

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
  const [show, setShow] = useState<boolean>(false);
  const { data, setData } = useData({
    index: currentIndex,
    area: "",
    badge: "",
    date: "",
    election_name: "",
    state: "",
    results: [],
    loading: true,
  });
  const { t, i18n } = useTranslation("sejarah");

  if (!options) return <></>;

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="reset"
          className="btn text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          onClick={() => {
            setData("loading", true);
            setShow(true);
            getData(options[data.index]);
            onChange(selected).then((results) => {
              if (!results) return;
              setData("results", results);
              setData("loading", false);
            });
          }}
        >
          <ArrowsPointingOutIcon className="h-4.5 w-4.5" />
          <p className="whitespace-nowrap font-normal">{t("full_result")}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-4xl">
        <div className="relative border-slate-200 dark:border-zinc-700 shadow-floating w-full rounded-t-xl border bg-white p-6 text-left align-middle dark:bg-zinc-900">
          <DialogHeading className="flex w-full items-start justify-between pr-8 text-lg uppercase">
            <div className="flex flex-wrap gap-x-2">
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
            <DialogClose className="absolute right-5 top-7 shrink-0" />
          </DialogHeading>
          <DialogDescription>
            <div className="space-y-6 text-base">
              <div className="space-x-3 pt-3">
                {!isParti && (
                  <>
                    <span className="uppercase">
                      {t(data.election_name, { ns: "election" })}
                    </span>
                    <span className="text-zinc-500">{data.date}</span>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="font-bold">{t("election_result")}</div>
                <Table
                  className="max-h-96 w-full overflow-y-auto"
                  data={data.results.data}
                  columns={columns}
                  isLoading={data.loading}
                  highlightedRows={
                    data.results.data && highlighted
                      ? "name" in data.results.data[0]
                        ? [
                            data.results.data.findIndex(
                              (e: BaseResult) => slugify(e.name) === highlighted
                            ),
                          ]
                        : "party" in data.results.data[0]
                        ? [
                            data.results.data.findIndex(
                              (e: BaseResult) => e.party === highlighted
                            ),
                          ]
                        : [-1]
                      : [0]
                  }
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
                            <BarPerc
                              hidden
                              value={item.perc}
                              size="h-[5px] w-[50px]"
                            />
                            <p>{`${
                              item.abs !== null
                                ? numFormat(item.abs, "standard")
                                : "—"
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
              {options.length > 1 && (
                <div className="space-y-3">
                  {options && options?.length <= 10 && (
                    <div className="flex flex-row items-center justify-center gap-1.5">
                      {options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setData("loading", true);
                            onChange(option).then((results) => {
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
                              ? "bg-zinc-900 dark:bg-white"
                              : "bg-slate-200 hover:bg-slate-100 dark:bg-zinc-700 dark:hover:bg-zinc-800"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  {options.length > 1 && (
                    <div className="flex items-center justify-center gap-4 text-sm font-medium">
                      <Button
                        className="btn-default btn-disabled"
                        onClick={() => {
                          setData("loading", true);
                          onChange(options[data.index - 1]).then((results) => {
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
                        className="btn-default btn-disabled"
                        onClick={() => {
                          setData("loading", true);
                          onChange(options[data.index + 1]).then((results) => {
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
                  )}
                </div>
              )}
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullResults;
