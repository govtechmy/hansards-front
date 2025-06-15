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
import { useTranslation } from "@hooks/useTranslation";
import { PARTIES } from "@lib/options";
import { OptionType } from "@lib/types";
import { ParsedUrlQuery } from "querystring";
import { useRef, useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import {
  AGES,
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_GENDERS,
  DEWANS,
  ETHNICITIES,
  GENDERS,
} from "../filter-options";
import { setSearchParams } from "@lib/utils";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { get } from "@lib/api";

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
  const [suggestion, setSuggestion] = useState<string>("");

  const { q, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, gender } =
    query;

  const { data, setData } = useData({
    query: q ? String(q) : "",
    dewan: dewan ? String(dewan) : "dewan-negara",
    age: umur ? String(umur) : ALL_AGES,
    etnik: etnik ? String(etnik) : ALL_ETHNICITIES,
    party: parti ? String(parti) : ALL_PARTIES,
    gender: gender ? String(gender) : BOTH_GENDERS,
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

  const GENDER_OPTIONS: OptionType[] = GENDERS.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const ETNIK_OPTIONS: OptionType[] = ETHNICITIES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const router = useRouter();

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (data.query.length > 0) {
        try {
          const result = await getAutocomplete(data.query);
          if (result.suggestions && result.suggestions.length > 0) {
            setSuggestion(result.suggestions[0]);
          } else {
            setSuggestion("");
          }
        } catch (error) {
          console.error("Error fetching autocomplete:", error);
          setSuggestion("");
        }
      } else {
        setSuggestion("");
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestion, 200);

    return () => clearTimeout(debounceTimeout);
  }, [data.query]);

  const formatDate = (date?: Date) => (!date ? "" : format(date, "yyyy-MM-dd"));

  const handleSearch = (params: Record<string, string | null>) => {
    onLoad();
    router.push(`${routes.CARI}${setSearchParams(router.asPath, params)}`);
  };

  const getAutocomplete = async (query: string) => {
    try {
      const response = await get(
        "api/autocomplete",
        {
          q: query,
        },
        "app"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
      return { suggestions: [], query };
    }
  };

  const handleClear = () => {
    if (data.query) {
      handleSearch({
        parti: "",
        umur: "",
        etnik: "",
        gender: "",
        tarikh_akhir: "",
        tarikh_mula: "",
      });
    }
    setSelectedDateRange(undefined);
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("etnik", ALL_ETHNICITIES);
    setData("gender", BOTH_GENDERS);
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
              if (data.query) handleSearch({ dewan });
            }}
            defaultValue="dewan-negara"
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
          <div className="relative flex-grow">
            <input
              readOnly
              tabIndex={-1}
              value={
                suggestion &&
                data.query &&
                suggestion.toLowerCase().startsWith(data.query.toLowerCase()) &&
                suggestion.toLowerCase() !== data.query.toLowerCase()
                  ? suggestion
                  : ""
              }
              className="pointer-events-none absolute inset-0 w-full truncate border-none bg-transparent text-gray-400 placeholder:text-transparent focus:outline-none focus:ring-0"
            />
            <input
              required
              spellCheck="false"
              type="text"
              value={data.query}
              onChange={e => {
                setData("query", e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch({
                    dewan: data.dewan,
                    q: data.query,
                  });
                } else if (
                  (e.key === "Tab" || //tab for suggestion text comppletion
                    (e.key === "ArrowRight" &&
                      e.currentTarget.selectionStart === data.query.length)) &&
                  suggestion &&
                  suggestion
                    .toLowerCase()
                    .startsWith(data.query.toLowerCase()) &&
                  suggestion.toLowerCase() !== data.query.toLowerCase()
                ) {
                  e.preventDefault();
                  setData("query", suggestion);
                  setSuggestion("");
                }
              }}
              placeholder={t("search_keyword")}
              className="relative w-full truncate border-none bg-transparent focus:outline-none focus:ring-0"
              ref={inputRef}
            />
          </div>
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
            className="size-9 justify-center rounded-full max-sm:p-1.5 sm:w-fit"
            disabled={!data.query}
            onClick={() =>
              handleSearch({
                dewan: data.dewan,
                q: data.query,
                parti: data.party !== ALL_PARTIES ? data.party : "",
                gender: data.gender !== BOTH_GENDERS ? data.gender : "",
                umur: data.age !== ALL_AGES ? data.age : "",
                etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                tarikh_akhir: formatDate(selectedDateRange?.from),
                tarikh_mula: formatDate(selectedDateRange?.to),
              })
            }
          >
            <MagnifyingGlassIcon className="size-5 text-white" />
            <span className="hidden sm:block">
              {t("placeholder.search", { ns: "common" })}
            </span>
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
            if (data.query && dateRange && dateRange.from && dateRange.to)
              handleSearch({
                tarikh_akhir: formatDate(dateRange.from),
                tarikh_mula: formatDate(dateRange.to),
              });
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
              handleSearch({
                parti: e.value,
              });
          }}
        />
        <Dropdown
          sublabel={t("gender", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={GENDER_OPTIONS}
          selected={GENDER_OPTIONS.find(e => e.value === data.gender)}
          onChange={e => {
            setData("gender", e.value);
            if (data.query)
              handleSearch({
                gender: e.value,
              });
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
              handleSearch({
                umur: e.value,
              });
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
              handleSearch({
                etnik: e.value,
              });
          }}
        />

        {(selectedDateRange ||
          data.party !== ALL_PARTIES ||
          data.gender !== BOTH_GENDERS ||
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
                <Label label={t("gender", { ns: "demografi" }) + ":"} />
                <Dropdown
                  width="w-full"
                  options={GENDER_OPTIONS}
                  selected={GENDER_OPTIONS.find(e => e.value === data.gender)}
                  onChange={e => setData("gender", e.value)}
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
                handleSearch({
                  dewan: data.dewan,
                  parti: data.party !== ALL_PARTIES ? data.party : "",
                  gender: data.gender !== BOTH_GENDERS ? data.gender : "",
                  umur: data.age !== ALL_AGES ? data.age : "",
                  etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                  tarikh_akhir: formatDate(selectedDateRange?.from),
                  tarikh_mula: formatDate(selectedDateRange?.to),
                });
              }}
            >
              {t("filter", { ns: "common" })}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center text-foreground"
              onClick={() => {
                handleClear();
                setOpen(false);
              }}
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
