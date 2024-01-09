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
  ComboBox,
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
import { OptionType } from "@lib/types";
import { format } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_SEXES,
  DEWAN_ENUM,
  DEWAN_INDEX_ENUM,
} from "../filter-options";
import { slugify } from "@lib/helpers";

/**
 * MP - Filter
 * @overview Status: In-development
 */

export interface MPFilterProps {
  individu_list: string[];
  onLoad: () => void;
  query: ParsedUrlQuery;
}

const MPFilter = ({ individu_list, onLoad, query }: MPFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);

  const { q, dewan, start_date, end_date } = query;

  const { data, setData } = useData({
    query: q ?? "",
    individu_option: "",
    ind_or_grp: "individu",
    dewan_idx: dewan ? DEWAN_INDEX_ENUM[dewan.toString()] : 0,
    dewan: dewan ?? "dewan-rakyat",
    age: ALL_AGES,
    etnik: ALL_ETHNICITIES,
    party: ALL_PARTIES,
    sex: BOTH_SEXES,
  });

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const { setFilter } = useFilter({
    q: q,
    dewan: dewan,
    start_date: start_date ?? "",
    end_date: end_date ?? "",
  });

  const INDIVIDU_OR_GROUP: OptionType[] = [
    {
      label: t("individu", { ns: "common" }),
      value: "individu",
    },
    {
      label: t("group", { ns: "home" }),
      value: "group",
    },
  ];

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

  const INDIVIDU_OPTIONS: OptionType[] = individu_list.map((key: string) => {
    return { label: key, value: slugify(key) };
  });

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
      label: key,
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
    setFilter(
      "start_date",
      selectedDateRange?.from
        ? format(selectedDateRange.from, "yyyy-MM-dd")
        : ""
    );
    setFilter(
      "end_date",
      selectedDateRange?.to
        ? format(selectedDateRange.to, "yyyy-MM-dd")
        : selectedDateRange?.from
        ? format(selectedDateRange.from, "yyyy-MM-dd")
        : ""
    );
  };

  const handleClear = () => {
    setData("query", "");
    setSelectedDateRange(undefined);
    setData("start_date", "");
    setData("end_date", "");
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("etnik", ALL_ETHNICITIES);
    setData("sex", BOTH_SEXES);
  };

  return (
    <>
      <div className="sm:pt-6 pb-3 space-y-6">
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
        {data.ind_or_grp === "individu" ? (
          <div className="w-full sm:w-[500px] mx-auto">
            <ComboBox
              placeholder={t("search_individual")}
              options={INDIVIDU_OPTIONS}
              selected={
                data.individu_option
                  ? INDIVIDU_OPTIONS.find(
                      (e) => e.value === data.individu_option.value
                    )
                  : null
              }
              dropdown={
                <div className="flex self-center pl-4.5">
                  <Dropdown
                    className="p-0 border-none shadow-none hover:underline [text-underline-position:from-font] active:bg-inherit active:dark:bg-inherit hover:bg-inherit hover:dark:bg-inherit"
                    width="w-fit"
                    options={INDIVIDU_OR_GROUP}
                    selected={INDIVIDU_OR_GROUP.find(
                      (e) => e.value === data.ind_or_grp
                    )}
                    onChange={(e) => setData("ind_or_grp", e.value)}
                  />
                </div>
              }
              onChange={(selected) => {
                setData("individu_option", selected);
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="pl-4.5 pr-1.5 py-2 flex mx-auto w-full sm:w-fit rounded-full border border-slate-200 dark:border-zinc-800 justify-between">
              <div className="flex self-center">
                <Dropdown
                  className="p-0 border-none shadow-none hover:underline [text-underline-position:from-font] active:bg-inherit active:dark:bg-inherit hover:bg-inherit hover:dark:bg-inherit"
                  width="w-fit"
                  options={INDIVIDU_OR_GROUP}
                  selected={INDIVIDU_OR_GROUP.find(
                    (e) => e.value === data.ind_or_grp
                  )}
                  onChange={(e) => setData("ind_or_grp", e.value)}
                />
              </div>
              <div className="hidden md:flex gap-x-1 px-2.5">
                <Dropdown
                  className="text-blue-600 rounded-full"
                  width="w-fit"
                  enableFlag
                  flag={(party) => {
                    if (party === ALL_PARTIES) return <></>;
                    else
                      return <PartyFlag party={party} children={() => true} />;
                  }}
                  options={PARTY_OPTIONS}
                  selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
                  onChange={(e) => setData("party", e.value)}
                />
                <Dropdown
                  className="text-blue-600 rounded-full"
                  width="w-fit"
                  options={SEX_OPTIONS}
                  selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                  onChange={(e) => setData("sex", e.value)}
                />
                <Dropdown
                  className="text-blue-600 rounded-full"
                  width="w-fit"
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                  onChange={(e) => setData("age", e.value)}
                />
                <Dropdown
                  className="text-blue-600 rounded-full"
                  width="w-fit"
                  options={ETNIK_OPTIONS}
                  selected={ETNIK_OPTIONS.find((e) => e.value === data.etnik)}
                  onChange={(e) => setData("etnik", e.value)}
                />
                {(data.party !== ALL_PARTIES ||
                  data.sex !== BOTH_SEXES ||
                  data.age !== ALL_AGES ||
                  data.etnik !== ALL_ETHNICITIES) && (
                  <Button
                    variant="ghost"
                    className="group flex sm:-mr-1.5 sm:h-8 sm:w-8 p-0 justify-center rounded-full"
                    onClick={() => {
                      setData("query", "");
                    }}
                  >
                    <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Button>
                )}
              </div>
              <div className="self-center">
                <Button
                  variant="primary"
                  className="rounded-full h-9"
                  onClick={() => handleSearch()}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                  {t("placeholder.search", { ns: "common" })}
                </Button>
              </div>
            </div>

            <div className="justify-center hidden md:flex flex-wrap gap-2">
              <Daterange
                className="text-blue-600"
                placeholder={t("current_parlimen")}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                setSelected={setSelectedDateRange}
              />

              {selectedDateRange && (
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

            {/* Mobile Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="shadow-button ml-auto md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="bg-blue-600 dark:bg-primary-dark w-4.5 leading-5 rounded-md text-center text-white">
                    6
                  </span>
                  <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <div className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-t-xl flex flex-col gap-y-0">
                  <DialogHeading className="px-3 py-4.5 flex justify-between border-b border-slate-200 dark:border-zinc-800">
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
                              placeholder={t("current_parlimen")}
                              selected={selectedDateRange}
                              setSelected={setSelectedDateRange}
                            />
                          </div>

                          <div className="py-3 space-y-1 w-full">
                            <Label label={t("party", { ns: "common" }) + ":"} />
                            <Dropdown
                              enableFlag
                              flag={(party) => {
                                if (party === ALL_PARTIES) return <></>;
                                else
                                  return (
                                    <PartyFlag
                                      party={party}
                                      children={() => true}
                                    />
                                  );
                              }}
                              anchor="left"
                              options={PARTY_OPTIONS}
                              selected={PARTY_OPTIONS.find(
                                (e) => e.value === data.party
                              )}
                              onChange={(e) => setData("party", e.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 py-3">
                            <div className="space-y-1 w-full">
                              <Label
                                label={t("age", { ns: "demografi" }) + ":"}
                              />
                              <Dropdown
                                anchor="left bottom-10"
                                options={AGE_OPTIONS}
                                selected={AGE_OPTIONS.find(
                                  (e) => e.value === data.age
                                )}
                                onChange={(e) => setData("age", e.value)}
                              />
                            </div>

                            <div className="space-y-1 w-full">
                              <Label
                                label={t("sex", { ns: "demografi" }) + ":"}
                              />
                              <Dropdown
                                options={SEX_OPTIONS}
                                selected={SEX_OPTIONS.find(
                                  (e) => e.value === data.sex
                                )}
                                onChange={(e) => setData("sex", e.value)}
                              />
                            </div>
                          </div>

                          <div className="py-3 space-y-1 w-full">
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};

export default MPFilter;
