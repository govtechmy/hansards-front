import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
} from "@components/Drawer";
import {
  Button,
  Daterange,
  Dropdown,
  Label,
  PartyFlag,
} from "@components/index";
import { Tabs, TabsList, TabsTrigger } from "@components/Tabs";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { PARTIES } from "@lib/options";
import { OptionType } from "@lib/types";
import { format } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  AGES,
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_SEXES,
  DEWANS,
  ETHNICITIES,
  SEXES,
} from "../filter-options";

/**
 * Keyword - Filter
 * @overview Status: In-development
 */

export interface KeywordFilterProps {
  onLoad: () => void;
  query: ParsedUrlQuery;
}

const KeywordFilter = ({ onLoad, query }: KeywordFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { q, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, jantina } =
    query;

  const { data, setData } = useData({
    query: q ? String(q) : "",
    dewan: dewan ? String(dewan) : "dewan-rakyat",
    age: umur ? String(umur) : ALL_AGES,
    etnik: etnik ? String(etnik) : ALL_ETHNICITIES,
    party: parti ? String(parti) : ALL_PARTIES,
    sex: jantina ? String(jantina) : BOTH_SEXES,
  });

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(
    tarikh_mula || tarikh_akhir
      ? {
          from: tarikh_mula ? new Date(tarikh_mula.toString()) : undefined,
          to: tarikh_akhir ? new Date(tarikh_akhir.toString()) : undefined,
        }
      : undefined
  );

  const { setFilter } = useFilter({
    dewan: dewan,
    q: q,
    tarikh_mula: tarikh_mula ?? "",
    tarikh_akhir: tarikh_akhir ?? "",
    parti: data.party === ALL_PARTIES ? "" : data.party,
    jantina: data.sex === BOTH_SEXES ? "" : data.sex,
    umur: data.age === ALL_AGES ? "" : data.age,
    etnik: data.etnik === ALL_ETHNICITIES ? "" : data.etnik,
  });

  const DEWAN_OPTIONS: OptionType[] = DEWANS.map((key: string) => ({
    label: t(key.replace("-", "_"), { ns: "common" }),
    value: key,
  }));

  const PARTY_OPTIONS: OptionType[] = [
    { label: t(ALL_PARTIES), value: ALL_PARTIES },
  ].concat(
    PARTIES.map((key: string) => ({
      label: t(key, { ns: "party" }),
      value: key,
    }))
  );

  const AGE_OPTIONS: OptionType[] = [
    { label: t(ALL_AGES, { ns: "demografi" }), value: ALL_AGES },
  ].concat(
    AGES.map((key: string) => ({
      label: key + (key === "70" ? "+" : ""),
      value: key,
    }))
  );

  const SEX_OPTIONS: OptionType[] = SEXES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const ETNIK_OPTIONS: OptionType[] = ETHNICITIES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const handleSearch = (
    dewan: string,
    party: string,
    sex: string,
    age: string,
    etnik: string,
    daterange?: DateRange
  ) => {
    onLoad();
    setFilter("dewan", dewan);
    setFilter("q", data.query);
    setFilter(
      "tarikh_mula",
      daterange?.from ? format(daterange.from, "yyyy-MM-dd") : ""
    );
    setFilter(
      "tarikh_akhir",
      daterange?.to
        ? format(daterange.to, "yyyy-MM-dd")
        : daterange?.from
        ? format(daterange.from, "yyyy-MM-dd")
        : ""
    );
    setFilter("parti", party === ALL_PARTIES ? "" : party);
    setFilter("jantina", sex === BOTH_SEXES ? "" : sex);
    setFilter("umur", age === ALL_AGES ? "" : age);
    setFilter("etnik", etnik === ALL_ETHNICITIES ? "" : etnik);
  };

  const handleClear = () => {
    setSelectedDateRange(undefined);
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("etnik", ALL_ETHNICITIES);
    setData("sex", BOTH_SEXES);
  };

  return (
    <>
      <div className="space-y-6 pb-3 sm:pt-6">
        {/* Dewan Selector */}
        <div className="mx-auto hidden w-fit rounded-full border border-slate-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:block">
          <Tabs
            value={data.dewan}
            onValueChange={dewan => {
              setData("dewan", dewan);
              if (data.query)
                handleSearch(
                  dewan,
                  data.party,
                  data.sex,
                  data.age,
                  data.etnik,
                  selectedDateRange
                );
            }}
            defaultValue="dewan-rakyat"
          >
            <TabsList className="flex-nowrap">
              {DEWAN_OPTIONS.map(dewan => (
                <TabsTrigger key={dewan.value} value={dewan.value}>
                  {dewan.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="mx-auto flex h-[50px] w-full select-none items-center gap-2.5 rounded-full border border-border bg-background py-3 pl-4.5 pr-1.5 hover:border-border-hover sm:w-[500px]">
          <input
            required
            spellCheck="false"
            type="text"
            value={data.query}
            onChange={e => setData("query", e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter")
                handleSearch(
                  data.dewan,
                  data.party,
                  data.sex,
                  data.age,
                  data.etnik,
                  selectedDateRange
                );
            }}
            placeholder={t("search_keyword")}
            className="grow truncate border-none bg-background focus:outline-none focus:ring-0"
            ref={inputRef}
          />
          {data.query && (
            <Button
              variant="ghost"
              className="group flex justify-center rounded-full p-0 sm:-mx-1.5 sm:h-8 sm:w-8"
              onClick={() => {
                setData("query", "");
                inputRef.current && inputRef.current.focus();
              }}
            >
              <XMarkIcon className="h-5 w-5 text-zinc-500 group-hover:text-foreground" />
            </Button>
          )}
          <Button
            variant="primary"
            className="h-9 rounded-full"
            disabled={!data.query}
            onClick={() =>
              handleSearch(
                data.dewan,
                data.party,
                data.sex,
                data.age,
                data.etnik,
                selectedDateRange
              )
            }
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            {t("placeholder.search", { ns: "common" })}
          </Button>
        </div>
      </div>

      {/* Desktop Bar */}
      <div className="hidden flex-wrap justify-center gap-2 sm:flex">
        <Daterange
          className="text-blue-600"
          placeholder={t("current_parlimen")}
          label={t("date", { ns: "home" })}
          selected={selectedDateRange}
          onChange={dateRange => {
            setSelectedDateRange(dateRange);
            if (data.query && dateRange && dateRange?.from && dateRange?.to)
              handleSearch(
                data.dewan,
                data.party,
                data.sex,
                data.age,
                data.etnik,
                dateRange
              );
          }}
        />

        <Dropdown
          sublabel={t("party", { ns: "common" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          enableFlag
          flag={party => {
            if (party === ALL_PARTIES) return <></>;
            else return <PartyFlag party={party} children={() => true} />;
          }}
          options={PARTY_OPTIONS}
          selected={PARTY_OPTIONS.find(e => e.value === data.party)}
          onChange={e => {
            setData("party", e.value);
            if (data.query)
              handleSearch(
                data.dewan,
                e.value,
                data.sex,
                data.age,
                data.etnik,
                selectedDateRange
              );
          }}
        />
        <Dropdown
          sublabel={t("sex", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={SEX_OPTIONS}
          selected={SEX_OPTIONS.find(e => e.value === data.sex)}
          onChange={e => {
            setData("sex", e.value);
            if (data.query)
              handleSearch(
                data.dewan,
                data.party,
                e.value,
                data.age,
                data.etnik,
                selectedDateRange
              );
          }}
        />
        <Dropdown
          sublabel={t("age_group", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={AGE_OPTIONS}
          selected={AGE_OPTIONS.find(e => e.value === data.age)}
          onChange={e => {
            setData("age", e.value);
            if (data.query)
              handleSearch(
                data.dewan,
                data.party,
                data.sex,
                e.value,
                data.etnik,
                selectedDateRange
              );
          }}
        />
        <Dropdown
          sublabel={t("ethnicity", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={ETNIK_OPTIONS}
          selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
          onChange={e => {
            setData("etnik", e.value);
            if (data.query)
              handleSearch(
                data.dewan,
                data.party,
                data.sex,
                data.age,
                e.value,
                selectedDateRange
              );
          }}
        />

        {(selectedDateRange ||
          data.party !== ALL_PARTIES ||
          data.sex !== BOTH_SEXES ||
          data.age !== ALL_AGES ||
          data.etnik !== ALL_ETHNICITIES) && (
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

      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto shadow-button sm:hidden"
            onClick={() => setOpen(true)}
          >
            <span>{t("filters", { ns: "common" })}</span>
            <span className="w-4.5 rounded-md bg-blue-600 text-center leading-5 text-white dark:bg-primary-dark">
              6
            </span>
            <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex justify-between border-b border-slate-200 dark:border-zinc-700">
            <span className="font-semibold text-foreground">
              {t("filters", { ns: "common" }) + ":"}
            </span>
            <DrawerClose>
              <XMarkIcon className="h-6 w-6 text-zinc-500" />
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-col divide-y divide-border bg-background px-4">
            <div className="space-y-1 py-3">
              <Label label={t("dewan", { ns: "home" }) + ":"} />
              <Dropdown
                width="w-full"
                options={DEWAN_OPTIONS}
                selected={DEWAN_OPTIONS.find(e => e.value === data.dewan)}
                onChange={e => setData("dewan", e.value)}
              />
            </div>

            <div className="space-y-1 py-3">
              <Label label={t("date") + ":"} />
              <Daterange
                className="w-full"
                numberOfMonths={1}
                placeholder={t("current_parlimen")}
                selected={selectedDateRange}
                onChange={setSelectedDateRange}
              />
            </div>

            <div className="space-y-1 py-3">
              <Label label={t("party", { ns: "common" }) + ":"} />
              <Dropdown
                width="w-full"
                enableFlag
                flag={party => {
                  if (party === ALL_PARTIES) return <></>;
                  else return <PartyFlag party={party} children={() => true} />;
                }}
                options={PARTY_OPTIONS}
                selected={PARTY_OPTIONS.find(e => e.value === data.party)}
                onChange={e => setData("party", e.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3 py-3">
              <div className="space-y-1">
                <Label label={t("age", { ns: "demografi" }) + ":"} />
                <Dropdown
                  width="w-full"
                  anchor="left bottom-10"
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find(e => e.value === data.age)}
                  onChange={e => setData("age", e.value)}
                />
              </div>

              <div className="space-y-1">
                <Label label={t("sex", { ns: "demografi" }) + ":"} />
                <Dropdown
                  width="w-full"
                  options={SEX_OPTIONS}
                  selected={SEX_OPTIONS.find(e => e.value === data.sex)}
                  onChange={e => setData("sex", e.value)}
                />
              </div>
            </div>

            <div className="space-y-1 py-3">
              <Label label={t("ethnicity", { ns: "demografi" }) + ":"} />
              <Dropdown
                width="w-full"
                anchor="bottom-10"
                options={ETNIK_OPTIONS}
                selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
                onChange={e => setData("etnik", e.value)}
              />
            </div>
          </div>

          <DrawerFooter>
            <Button
              variant="primary"
              className="w-full justify-center shadow-button"
              onClick={() => {
                setOpen(false);
                onLoad();
                handleSearch(
                  data.dewan,
                  data.party,
                  data.sex,
                  data.age,
                  data.etnik,
                  selectedDateRange
                );
              }}
            >
              {t("filter", { ns: "common" })}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center text-foreground"
              onClick={handleClear}
            >
              {t("clear_all", { ns: "common" })}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default KeywordFilter;
