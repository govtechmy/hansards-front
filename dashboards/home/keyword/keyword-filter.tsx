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
import {
  Select,
  SelectContent,
  SelectHeader,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/MydsSelectFix/MydsSelectFix";
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
import { useRef, useState, useMemo } from "react";
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
import { Dispatch, SetStateAction } from "react";

// hardcode first later fetch from backend
const PARLIMEN_SESSIONS: OptionType[] = [
  {
    label: "Semua",
    value: "1964-01-01_2027-01-01",
  },
  {
    label: "Penggal Kedua Mesyuarat Khas (13 Mac - 12 Apr 2026)",
    value: "2026-03-13_2026-04-12",
  },
  {
    label: "Penggal Kedua Mesyuarat Kedua (19 Feb - 12 Mac 2026)",
    value: "2026-02-19_2026-03-12",
  },
  {
    label: "Penggal Kedua Mesyuarat Pertama (17 Nov - 19 Dis 2025)",
    value: "2025-11-17_2025-12-19",
  },
  {
    label: "Penggal Pertama Mesyuarat Ketiga (14 Jul - 18 Sep 2025)",
    value: "2025-07-14_2025-09-18",
  },
  {
    label: "Penggal Pertama Mesyuarat Kedua (10 Mac - 10 Apr 2025)",
    value: "2025-03-10_2025-04-10",
  },
  {
    label: "Penggal Pertama Mesyuarat Pertama (10 Feb - 6 Mac 2025)",
    value: "2025-02-10_2025-03-06",
  },
  {
    label: "Penggal Keempat Mesyuarat Ketiga (18 Nov - 19 Dis 2024)",
    value: "2024-11-18_2024-12-19",
  },
  {
    label: "Penggal Keempat Mesyuarat Kedua (15 Jul - 12 Sep 2024)",
    value: "2024-07-15_2024-09-12",
  },
  {
    label: "Penggal Keempat Mesyuarat Pertama (26 Feb - 18 Apr 2024)",
    value: "2024-02-26_2024-04-18",
  },
  {
    label: "Penggal Ketiga Mesyuarat Ketiga (24 Jul - 14 Sep 2023)",
    value: "2023-07-24_2023-09-14",
  },
  {
    label: "Penggal Ketiga Mesyuarat Kedua (13 Mac - 6 Apr 2023)",
    value: "2023-03-13_2023-04-06",
  },
  {
    label: "Penggal Ketiga Mesyuarat Pertama (19 Dis 2022 - 25 Jan 2023)",
    value: "2022-12-19_2023-01-25",
  },
];

/**
 * Keyword - Filter
 * @overview Status: In-development
 */

export interface KeywordFilterProps {
  onLoad: () => void;
  query: ParsedUrlQuery;
  keywordQuery: string;
  setKeywordQuery: Dispatch<SetStateAction<string>>;
  suggestion: string;
  setSuggestion: Dispatch<SetStateAction<string>>;
  dewan_counts?: Record<string, number>;
}

const KeywordFilter = ({
  onLoad,
  query,
  keywordQuery,
  setKeywordQuery,
  suggestion,
  setSuggestion,
  dewan_counts,
}: KeywordFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessionSearch, setSessionSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { q, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, jantina } =
    query;

  const { data, setData } = useData({
    dewan: dewan ? String(dewan) : "semua",
    age: umur ? String(umur) : ALL_AGES,
    etnik: etnik ? String(etnik) : ALL_ETHNICITIES,
    party: parti ? String(parti) : ALL_PARTIES,
    gender: jantina ? String(jantina) : BOTH_GENDERS,
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
    { label: t(ALL_PARTIES, { ns: "home" }), value: ALL_PARTIES },
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

  const { suggestedValue, currentWord } = useMemo(() => {
    if (!suggestion || !keywordQuery)
      return { suggestedValue: "", currentWord: "" };

    const lastSpaceIndex = keywordQuery.lastIndexOf(" ");
    const currentWord = keywordQuery.substring(lastSpaceIndex + 1);

    if (
      currentWord.length > 0 &&
      suggestion.toLowerCase().startsWith(currentWord.toLowerCase()) &&
      suggestion.toLowerCase() !== currentWord.toLowerCase()
    ) {
      const prefix = keywordQuery.substring(0, lastSpaceIndex + 1);
      return { suggestedValue: prefix + suggestion, currentWord };
    }

    return { suggestedValue: "", currentWord };
  }, [suggestion, keywordQuery]);

  const formatDate = (date?: Date) => (!date ? "" : format(date, "yyyy-MM-dd"));

  const handleSearch = (params: Record<string, string | null>) => {
    onLoad();
    router.push(`${routes.CARI}${setSearchParams(router.asPath, params)}`);
  };

  const handleClear = () => {
    if (keywordQuery) {
      handleSearch({
        parti: "",
        umur: "",
        etnik: "",
        jantina: "",
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
              if (keywordQuery) handleSearch({ dewan });
            }}
            defaultValue="dewan-negara"
          >
            <TabsList className="flex-nowrap">
              {DEWAN_OPTIONS.map(dewan => (
                <TabsTrigger
                  key={dewan.value}
                  value={dewan.value}
                  className="gap-1"
                >
                  {dewan.label}
                  {keywordQuery &&
                    dewan_counts?.[dewan.value] !== undefined && (
                      <span className="rounded-full bg-secondary px-1 text-xs text-white">
                        {dewan_counts[dewan.value]}
                      </span>
                    )}
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
              value={suggestedValue}
              className="pointer-events-none absolute inset-0 w-full truncate border-none bg-transparent text-gray-400 placeholder:text-transparent focus:outline-none focus:ring-0"
            />
            <input
              required
              spellCheck="false"
              type="text"
              value={keywordQuery}
              onChange={e => {
                setKeywordQuery(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch({
                    dewan: data.dewan,
                    q: keywordQuery,
                  });
                } else if (
                  (e.key === "Tab" ||
                    (e.key === "ArrowRight" &&
                      e.currentTarget.selectionStart ===
                        keywordQuery.length)) &&
                  suggestion &&
                  (() => {
                    // Support multiple keyword suggestion if user has space
                    const lastSpaceIdx = keywordQuery.lastIndexOf(" ");
                    const currentWord =
                      lastSpaceIdx !== -1
                        ? keywordQuery.slice(lastSpaceIdx + 1)
                        : keywordQuery;
                    return (
                      suggestion
                        .toLowerCase()
                        .startsWith(currentWord.toLowerCase()) &&
                      suggestion.toLowerCase() !== currentWord.toLowerCase()
                    );
                  })()
                ) {
                  e.preventDefault();
                  // Complete only the last word with suggestion
                  const lastSpaceIdx = keywordQuery.lastIndexOf(" ");
                  const prefix =
                    lastSpaceIdx !== -1
                      ? keywordQuery.slice(0, lastSpaceIdx + 1)
                      : "";
                  setKeywordQuery(prefix + suggestion);
                  setSuggestion("");
                }
              }}
              placeholder={t("search_keyword")}
              className="relative w-full truncate border-none bg-transparent focus:outline-none focus:ring-0"
              ref={inputRef}
            />
          </div>
          {keywordQuery && (
            <Button
              variant="ghost"
              className="group flex justify-center rounded-full p-0 sm:-mx-1.5 sm:h-8 sm:w-8"
              onClick={() => {
                setKeywordQuery("");
                inputRef.current && inputRef.current.focus();
              }}
            >
              <XMarkIcon className="h-5 w-5 text-zinc-500 group-hover:text-foreground" />
            </Button>
          )}
          <Button
            variant="primary"
            className="size-9 justify-center rounded-full max-sm:p-1.5 sm:w-fit"
            disabled={!keywordQuery}
            onClick={() => {
              handleSearch({
                dewan: data.dewan,
                q: keywordQuery,
                parti: data.party !== ALL_PARTIES ? data.party : "",
                jantina: data.gender !== BOTH_GENDERS ? data.gender : "",
                umur: data.age !== ALL_AGES ? data.age : "",
                etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                tarikh_mula: formatDate(selectedDateRange?.from),
                tarikh_akhir: formatDate(selectedDateRange?.to),
              });
            }}
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
        <Select
          size="small"
          variant="outline"
          value={selectedSession}
          onValueChange={(value: string) => {
            setSelectedSession(value);
            setSessionSearch("");
            if (keywordQuery) {
              const [from, to] = value.split("_");
              handleSearch({ tarikh_mula: from, tarikh_akhir: to });
            }
          }}
        >
          <SelectTrigger className="text-blue-600 dark:text-primary-dark">
            <SelectValue placeholder={t("current_parlimen")}>
              {(val: string | string[]) =>
                val && !Array.isArray(val) && val !== ""
                  ? PARLIMEN_SESSIONS.find(s => s.value === val)?.label
                  : t("current_parlimen")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-[320px]">
            <SelectHeader>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  autoFocus
                  value={sessionSearch}
                  onChange={e => setSessionSearch(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  placeholder={t("placeholder.search", { ns: "common" })}
                  className="w-full rounded border border-zinc-200 py-1.5 pl-7 pr-3 text-xs outline-none focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </SelectHeader>
            {PARLIMEN_SESSIONS.filter(s =>
              (s.label as string)
                .toLowerCase()
                .includes(sessionSearch.toLowerCase())
            ).map(session => (
              <SelectItem key={session.value} value={session.value}>
                {session.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Daterange
          className="text-blue-600"
          placeholder={t("current_parlimen")}
          label={t("date", { ns: "home" })}
          selected={selectedDateRange}
          onChange={dateRange => {
            setSelectedDateRange(dateRange);
            if (keywordQuery && dateRange && dateRange.from && dateRange.to)
              handleSearch({
                tarikh_mula: formatDate(dateRange.from),
                tarikh_akhir: formatDate(dateRange.to),
              });
          }}
        />

        {/* <Dropdown
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
            if (keywordQuery)
              handleSearch({
                parti: e.value !== ALL_PARTIES ? e.value : "",
              });
          }}
        /> */}
        <Dropdown
          sublabel={t("gender", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={GENDER_OPTIONS}
          selected={GENDER_OPTIONS.find(e => e.value === data.gender)}
          onChange={e => {
            setData("gender", e.value);
            if (keywordQuery)
              handleSearch({
                jantina: e.value !== BOTH_GENDERS ? e.value : "",
              });
          }}
        />
        <Dropdown
          sublabel={t("age_group", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          showDisclaimer
          options={AGE_OPTIONS}
          selected={AGE_OPTIONS.find(e => e.value === data.age)}
          onChange={e => {
            setData("age", e.value);
            if (keywordQuery)
              handleSearch({
                umur: e.value !== ALL_AGES ? e.value : "",
              });
          }}
        />
        {/* <Dropdown
          sublabel={t("ethnicity", { ns: "demografi" })}
          className="text-blue-600 dark:text-primary-dark"
          width="w-fit"
          options={ETNIK_OPTIONS}
          selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
          onChange={e => {
            setData("etnik", e.value);
            if (keywordQuery)
              handleSearch({
                etnik: e.value !== ALL_ETHNICITIES ? e.value : "",
              });
          }}
        /> */}
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
                  showDisclaimer
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
                  jantina: data.gender !== BOTH_GENDERS ? data.gender : "",
                  umur: data.age !== ALL_AGES ? data.age : "",
                  etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                  tarikh_mula: formatDate(selectedDateRange?.from),
                  tarikh_akhir: formatDate(selectedDateRange?.to),
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
