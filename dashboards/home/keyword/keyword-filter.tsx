import Filter from "./filter-button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "@components/Dialog";
import {
  Button,
  Daterange,
  Dropdown,
  Label,
  List,
  PartyFlag,
} from "@components/index";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@lib/contexts/window";
import { Dewan, OptionType } from "@lib/types";
import { useState } from "react";

/**
 * Keyword - Filter
 * @overview Status: In-development
 */

export interface KeywordFilterProps {
  dewan?: Dewan;
  keyword: string;
  onLoad: () => void;
}

const KeywordFilter = ({ dewan, keyword, onLoad }: KeywordFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);

  const DEWAN_INDEX_ENUM: { [key: string]: number } = {
    "dewan-rakyat": 0,
    "dewan-negara": 1,
    "kamar-khas": 2,
  };

  const DEWAN_ENUM: { [key: number]: Dewan } = {
    0: "dewan-rakyat",
    1: "dewan-negara",
    2: "kamar-khas",
  };

  const ALL_AGES = "all_ages";
  const ALL_ETHNICITIES = "all_ethnicities";
  const ALL_PARTIES = "all_parties";
  const BOTH_SEXES = "both_sexes";

  const { data, setData } = useData({
    query: keyword ?? "",
    start_date: "",
    end_date: "",
    dewan_idx: dewan ? DEWAN_INDEX_ENUM[dewan] : 0,
    dewan: dewan ?? "dewan-rakyat",
    state: "mys",
    age: ALL_AGES,
    etnik: ALL_ETHNICITIES,
    party: ALL_PARTIES,
    sex: BOTH_SEXES,
  });

  const { setFilter } = useFilter({
    q: keyword,
    dewan: dewan,
    start_date: "",
    end_date: "",
  });

  const DEWAN_OPTIONS: OptionType[] = [
    {
      label: t("dewan_rakyat", { ns: "common" }),
      value: "dewan-rakyat",
    },
    {
      label: t("dewan_negara", { ns: "common" }),
      value: "dewan-negara",
    },
    {
      label: t("kamar_khas", { ns: "common" }),
      value: "kamar-khas",
    },
  ];

  const PARTY_OPTIONS: OptionType[] = [
    { label: t(ALL_PARTIES), value: ALL_PARTIES },
  ].concat(
    ["BEBAS", "BN", "DAP", "PAS", "PH", "PN", "WARISAN"].map((key: string) => ({
      label: t(key, { ns: "party" }),
      value: key,
    }))
  );

  const AGE_OPTIONS: OptionType[] = [
    { label: t(ALL_AGES, { ns: "demografi" }), value: ALL_AGES },
  ].concat(
    ["18-29", "30-39", "40-49", "50-59", "60-69", "70+"].map((key: string) => ({
      label: t(key),
      value: key,
    }))
  );

  const SEX_OPTIONS: OptionType[] = [
    { label: t(BOTH_SEXES, { ns: "demografi" }), value: BOTH_SEXES },
  ].concat(
    ["m", "f"].map((key: string) => ({
      label: t(key, { ns: "demografi" }),
      value: key,
    }))
  );

  const ETNIK_OPTIONS: OptionType[] = [
    { label: t(ALL_ETHNICITIES, { ns: "demografi" }), value: ALL_ETHNICITIES },
  ].concat(
    ["malay", "chinese", "indian", "bumi_sbh", "bumi_swk", "other"].map(
      (key: string) => ({
        label: t(key, { ns: "demografi" }),
        value: key,
      })
    )
  );

  const handleSearch = () => {
    onLoad();
    setFilter("q", data.query);
    setFilter("dewan", data.dewan);
    setFilter("start_date", data.start_date);
    setFilter("end_date", data.end_date);
  };

  const handleClear = () => {
    setData("query", "");
    setData("start_date", "");
    setData("end_date", "");
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("etnik", ALL_ETHNICITIES);
    setData("sex", BOTH_SEXES);
  };

  return (
    <>
      <div className="pt-6 pb-3 space-y-6">
        {/* Dewan Selector */}
        <div className="mx-auto sm:block hidden w-fit rounded-full p-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <List
            className="flex-nowrap"
            options={DEWAN_OPTIONS.map((item) => item.label)}
            current={data.dewan_idx}
            onChange={(i) => {
              setData("dewan", DEWAN_ENUM[i]);
              setData("dewan_idx", i);
            }}
          />
        </div>

        {/* Search Bar */}
        <div className="h-[50px] flex mx-auto pl-4.5 pr-1.5 py-3 gap-2.5 items-center w-full sm:w-[500px] bg-white dark:bg-zinc-900 select-none rounded-full border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 focus:outline-none">
          <span className="flex items-center">
            <MagnifyingGlassIcon className="dark:text-zinc-500 h-5 w-5 text-zinc-900" />
          </span>
          <input
            required
            autoFocus
            type="text"
            value={data.query}
            onChange={(e) => setData("query", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder={t("search_keyword")}
            className="grow truncate border-none bg-white focus:outline-none focus:ring-0 dark:bg-zinc-900"
          />
          {data.query && (
            <Button
              className="group flex h-8 w-8 justify-center p-0 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
              onClick={() => setData("query", "")}
            >
              <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
            </Button>
          )}
          <Button
            variant="primary"
            className="rounded-full h-9"
            disabled={!data.query}
            onClick={() => handleSearch()}
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            {t("placeholder.search", { ns: "common" })}
          </Button>
        </div>
      </div>

      {/* Desktop Bar */}
      <div className="justify-center hidden sm:flex gap-x-2">
        <Daterange
          className="text-blue-600"
          from={(start_date) => setData("start_date", start_date)}
          to={(end_date) => setData("end_date", end_date)}
          label={t("date", { ns: "home" })}
          selected={
            data.start_date && data.end_date
              ? { from: data.start_date, to: data.end_date }
              : undefined
          }
        />

        <Dropdown
          sublabel={t("party", { ns: "common" })}
          className="text-blue-600"
          enableFlag
          flag={(party) => <PartyFlag party={party} children={() => true} />}
          options={PARTY_OPTIONS}
          selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
          onChange={(e) => setData("party", e.value)}
        />
        <Dropdown
          sublabel={t("sex", { ns: "demografi" })}
          className="text-blue-600"
          options={SEX_OPTIONS}
          selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
          onChange={(e) => setData("sex", e.value)}
        />
        <Dropdown
          sublabel={t("age_group", { ns: "demografi" })}
          className="text-blue-600"
          options={AGE_OPTIONS}
          selected={AGE_OPTIONS.find((e) => e.value === data.age)}
          onChange={(e) => setData("age", e.value)}
        />
        <Dropdown
          sublabel={t("ethnicity", { ns: "demografi" })}
          className="text-blue-600"
          options={ETNIK_OPTIONS}
          selected={ETNIK_OPTIONS.find((e) => e.value === data.etnik)}
          onChange={(e) => setData("etnik", e.value)}
        />

        {(data.query ||
          data.start_date ||
          data.end_date ||
          data.party ||
          data.sex ||
          data.age ||
          data.etnik) && (
          <Button
            variant="ghost"
            className="w-fit justify-center"
            onClick={handleClear}
          >
            <XMarkIcon className="h-4.5 w-4.5" />
            {t("clear", { ns: "common" })}
          </Button>
        )}
      </div>

      <Button
        variant="default"
        className="shadow-button ml-auto sm:hidden"
        onClick={() => setOpen(true)}
      >
        <span>{t("filters", { ns: "common" })}</span>
        <span className="bg-blue-600 dark:bg-primary-dark w-4.5 leading-5 rounded-md text-center text-white">
          6
        </span>
        <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
      </Button>

      {/* Mobile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <WindowProvider>
            <Filter onClick={() => setOpen(!open)} />
          </WindowProvider>
        </DialogTrigger>
        <DialogContent className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 flex flex-col gap-y-0">
          <DialogHeading className="p-4.5 flex justify-between border-b border-slate-200 dark:border-zinc-800">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              {t("filters", { ns: "common" }) + ":"}
            </span>
            <DialogClose />
          </DialogHeading>
          <DialogDescription>
            <div className="flex flex-col">
              <div className="bg-white dark:bg-zinc-900">
                <div className="dark:divide-washed-dark divide-y px-3 pb-3">
                  <div className="py-3 space-y-1">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
                      options={DEWAN_OPTIONS}
                      selected={DEWAN_OPTIONS.find(
                        (e) => e.value === data.dewan
                      )}
                      onChange={(e) => setData("dewan", e.value)}
                    />
                  </div>

                  <div className="py-3 space-y-1">
                    <Label label={t("date") + ":"} />
                    <Daterange
                      className="w-full"
                      numberOfMonths={1}
                      from={(start_date) => setData("start_date", start_date)}
                      to={(end_date) => setData("end_date", end_date)}
                      placeholder="dd/mm/yyyy - dd/mm/yyyy"
                      selected={
                        data.start_date && data.end_date
                          ? { from: data.start_date, to: data.end_date }
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex gap-2 py-3">
                    <div className="space-y-1 w-full">
                      <Label label={t("party", { ns: "common" }) + ":"} />
                      <Dropdown
                        enableFlag
                        flag={(party) => (
                          <PartyFlag party={party} children={() => ""} />
                        )}
                        anchor="left bottom-10"
                        options={PARTY_OPTIONS}
                        selected={PARTY_OPTIONS.find(
                          (e) => e.value === data.party
                        )}
                        onChange={(e) => setData("party", e.value)}
                      />
                    </div>
                    <div className="space-y-1 w-full">
                      <Label label={t("age", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        anchor="left bottom-10"
                        options={AGE_OPTIONS}
                        selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                        onChange={(e) => setData("age", e.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 py-3">
                    <div className="space-y-1 w-full">
                      <Label label={t("sex", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        options={SEX_OPTIONS}
                        selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                        onChange={(e) => setData("sex", e.value)}
                      />
                    </div>
                    <div className="space-y-1 w-full">
                      <Label
                        label={t("ethnicity", { ns: "demografi" }) + ":"}
                      />
                      <Dropdown
                        anchor="left bottom-10"
                        options={ETNIK_OPTIONS}
                        selected={ETNIK_OPTIONS.find(
                          (e) => e.value === data.etnik
                        )}
                        onChange={(e) => setData("etnik", e.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="dark:border-washed-dark flex w-full flex-col gap-2 border-t bg-white p-3 dark:bg-black">
                  <Button
                    variant={"primary"}
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      onLoad();
                      handleSearch();
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
                    onClick={handleClear}
                  >
                    {t("clear_all", { ns: "common" })}
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeywordFilter;
