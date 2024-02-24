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
  List,
  PartyFlag,
} from "@components/index";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
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
  DEWAN_ENUM,
  DEWAN_IDX_ENUM,
  ETHNICITIES,
  PARTIES,
  SEXES,
} from "../filter-options";
import { useData } from "@hooks/useData";

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
    query: q ?? "",
    dewan_idx: dewan ? DEWAN_IDX_ENUM[dewan.toString()] : 0,
    dewan: dewan ?? "dewan-rakyat",
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
    q: q,
    dewan: dewan,
    tarikh_mula: tarikh_mula ?? "",
    tarikh_akhir: tarikh_akhir ?? "",
    umur: data.age === ALL_AGES ? "" : data.age,
    etnik: data.etnik === ALL_ETHNICITIES ? "" : data.etnik,
    parti: data.party === ALL_PARTIES ? "" : data.party,
    jantina: data.sex === BOTH_SEXES ? "" : data.sex,
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

  const handleSearch = () => {
    onLoad();
    setFilter("q", data.query);
    setFilter("dewan", data.dewan);
    setFilter("umur", data.age === ALL_AGES ? "" : data.age);
    setFilter("etnik", data.etnik === ALL_ETHNICITIES ? "" : data.etnik);
    setFilter("parti", data.party === ALL_PARTIES ? "" : data.party);
    setFilter("jantina", data.sex === BOTH_SEXES ? "" : data.sex);
    setFilter(
      "tarikh_mula",
      selectedDateRange?.from
        ? format(selectedDateRange.from, "yyyy-MM-dd")
        : ""
    );
    setFilter(
      "tarikh_akhir",
      selectedDateRange?.to
        ? format(selectedDateRange.to, "yyyy-MM-dd")
        : selectedDateRange?.from
          ? format(selectedDateRange.from, "yyyy-MM-dd")
          : ""
    );
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
        <div className="h-[50px] flex mx-auto pl-4.5 pr-1.5 py-3 gap-2.5 items-center w-full sm:w-[500px] bg-background select-none rounded-full border border-border hover:border-border-hover">
          <input
            required
            spellCheck="false"
            type="text"
            value={data.query}
            onChange={(e) => setData("query", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder={t("search_keyword")}
            className="grow truncate border-none bg-background focus:outline-none focus:ring-0"
            ref={inputRef}
          />
          {data.query && (
            <Button
              variant="ghost"
              className="group flex sm:-mx-1.5 sm:h-8 sm:w-8 p-0 justify-center rounded-full"
              onClick={() => {
                setData("query", "");
                inputRef.current && inputRef.current.focus();
              }}
            >
              <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-foreground" />
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
      <div className="justify-center hidden sm:flex flex-wrap gap-2">
        <Daterange
          className="text-blue-600"
          placeholder={t("current_parlimen")}
          label={t("date", { ns: "home" })}
          selected={selectedDateRange}
          setSelected={setSelectedDateRange}
        />

        <Dropdown
          sublabel={t("party", { ns: "common" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          enableFlag
          flag={(party) => {
            if (party === ALL_PARTIES) return <></>;
            else return <PartyFlag party={party} children={() => true} />;
          }}
          options={PARTY_OPTIONS}
          selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
          onChange={(e) => setData("party", e.value)}
        />
        <Dropdown
          sublabel={t("sex", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={SEX_OPTIONS}
          selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
          onChange={(e) => setData("sex", e.value)}
        />
        <Dropdown
          sublabel={t("age_group", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={AGE_OPTIONS}
          selected={AGE_OPTIONS.find((e) => e.value === data.age)}
          onChange={(e) => setData("age", e.value)}
        />
        <Dropdown
          sublabel={t("ethnicity", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={ETNIK_OPTIONS}
          selected={ETNIK_OPTIONS.find((e) => e.value === data.etnik)}
          onChange={(e) => setData("etnik", e.value)}
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
            className="shadow-button ml-auto sm:hidden"
            onClick={() => setOpen(true)}
          >
            <span>{t("filters", { ns: "common" })}</span>
            <span className="bg-blue-600 dark:bg-primary-dark w-4.5 leading-5 rounded-md text-center text-white">
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
              <XMarkIcon className="text-zinc-500 h-6 w-6" />
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-col bg-background divide-border divide-y px-4">
            <div className="py-3 space-y-1">
              <Label label={t("dewan", { ns: "home" }) + ":"} />
              <Dropdown
                width="w-full"
                options={DEWAN_OPTIONS}
                selected={DEWAN_OPTIONS.find((e) => e.value === data.dewan)}
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

            <div className="py-3 space-y-1">
              <Label label={t("party", { ns: "common" }) + ":"} />
              <Dropdown
                width="w-full"
                enableFlag
                flag={(party) => {
                  if (party === ALL_PARTIES) return <></>;
                  else return <PartyFlag party={party} children={() => true} />;
                }}
                options={PARTY_OPTIONS}
                selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
                onChange={(e) => setData("party", e.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3 py-3">
              <div className="space-y-1">
                <Label label={t("age", { ns: "demografi" }) + ":"} />
                <Dropdown
                  width="w-full"
                  anchor="left bottom-10"
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                  onChange={(e) => setData("age", e.value)}
                />
              </div>

              <div className="space-y-1">
                <Label label={t("sex", { ns: "demografi" }) + ":"} />
                <Dropdown
                  width="w-full"
                  options={SEX_OPTIONS}
                  selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                  onChange={(e) => setData("sex", e.value)}
                />
              </div>
            </div>

            <div className="py-3 space-y-1">
              <Label label={t("ethnicity", { ns: "demografi" }) + ":"} />
              <Dropdown
                width="w-full"
                anchor="bottom-10"
                options={ETNIK_OPTIONS}
                selected={ETNIK_OPTIONS.find((e) => e.value === data.etnik)}
                onChange={(e) => setData("etnik", e.value)}
              />
            </div>
          </div>

          <DrawerFooter>
            <Button
              variant="primary"
              className="shadow-button w-full justify-center"
              onClick={() => {
                setOpen(false);
                onLoad();
                handleSearch();
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
