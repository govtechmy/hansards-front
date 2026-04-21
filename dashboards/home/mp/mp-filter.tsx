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
  ComboBox,
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
import { OptionType, Speaker } from "@lib/types";
import { useMemo, useRef, useState, type SVGProps } from "react";
import { DateRange } from "react-day-picker";
import {
  AGES,
  ALL_AGES2,
  ALL_ETHNICITIES,
  ALL_PARTIES2,
  BOTH_GENDERS2,
  DEWANS,
  ETHNICITIES,
} from "../filter-options";
import { useRouter } from "next/router";
import { setSearchParams } from "@lib/utils";
import { ParsedUrlQuery } from "querystring";
import { format } from "date-fns";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { flushSync } from "react-dom";

type TakwimSession = { session: number; start_date: string; end_date: string };
type TakwimTerm = {
  term: number;
  start_date: string;
  end_date: string;
  sessions: TakwimSession[];
};

export type { TakwimTerm };

const MONTHS: Record<string, string[]> = {
  "ms-MY": [
    "Jan",
    "Feb",
    "Mac",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ogos",
    "Sep",
    "Okt",
    "Nov",
    "Dis",
  ],
  "en-GB": [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const formatDateStr = (dateStr: string, locale: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = MONTHS[locale] ?? MONTHS["ms-MY"];
  return `${day} ${months[month - 1]} ${year}`;
};

const buildParlimenSessions = (
  takwim: TakwimTerm[] | null | undefined,
  t: (key: string, options?: object) => string,
  locale: string
): OptionType[] => {
  const terms = takwim ?? [];
  const startDate =
    terms.length > 0
      ? terms.reduce(
          (min, t) => (t.start_date < min ? t.start_date : min),
          terms[0].start_date
        )
      : "1959-09-11";
  const endDate =
    terms.length > 0
      ? terms.reduce(
          (max, t) => (t.end_date > max ? t.end_date : max),
          terms[0].end_date
        )
      : "2027-01-01";
  const SEMUA_OPTION: OptionType = {
    label: t("semua", { ns: "common" }),
    value: `${startDate}_${endDate}`,
  };

  return [
    SEMUA_OPTION,
    ...terms
      .slice()
      .reverse()
      .flatMap(term =>
        [...term.sessions].reverse().map(session => ({
          label: `${t("parlimen_full", { ns: "enum", n: term.term })} | ${t("penggal_full", { ns: "enum", n: session.session })}`,
          label2: `${formatDateStr(session.start_date, locale)} - ${formatDateStr(session.end_date, locale)}`,
          value: `${session.start_date}_${session.end_date}`,
        }))
      ),
  ];
};

const HeroChevronDown = ({ className }: SVGProps<SVGSVGElement>) => (
  <ChevronDownIcon className={className ?? "w-5"} />
);

/**
 * MP - Filter
 * @overview Status: In-development
 */

export interface MPFilterProps {
  ind_or_grp: string;
  speakers: Array<Speaker>;
  onFilter: (e: string) => void;
  onLoad: () => void;
  query: ParsedUrlQuery;
  takwim?: TakwimTerm[] | null;
}

const MPFilter = ({
  ind_or_grp,
  speakers,
  onFilter,
  onLoad,
  query,
  takwim,
}: MPFilterProps) => {
  const { t, i18n } = useTranslation([
    "home",
    "common",
    "demografi",
    "party",
    "enum",
  ]);
  const [open, setOpen] = useState<boolean>(false);
  const GENDERS = [BOTH_GENDERS2, "m", "f"];
  const PARLIMEN_SESSIONS = useMemo(
    () => buildParlimenSessions(takwim, t, i18n.language),
    [takwim, i18n.language]
  );
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessionSearch, setSessionSearch] = useState<string>("");
  const [sessionSearchMobile, setSessionSearchMobile] = useState<string>("");
  const sessionSearchRef = useRef<HTMLInputElement | null>(null);
  const sessionSearchMobileRef = useRef<HTMLInputElement | null>(null);

  const { uid, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, gender } =
    query;

  const INDIVIDU_OPTIONS: OptionType[] = speakers
    .map(({ name, new_author_id }) => ({
      label: name,
      value: String(new_author_id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const { data, setData } = useData({
    uid: uid ? String(uid) : "",
    individu_option: uid
      ? INDIVIDU_OPTIONS.find(option => option.value === String(uid))
      : undefined,
    dewan: dewan ? String(dewan) : "semua",
    age: umur ? String(umur) : ALL_AGES2,
    etnik: etnik ? String(etnik) : ALL_ETHNICITIES,
    party: parti ? String(parti) : ALL_PARTIES2,
    gender: gender ? String(gender) : BOTH_GENDERS2,
  });

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(
    tarikh_mula || tarikh_akhir
      ? {
          from: tarikh_mula ? new Date(String(tarikh_mula)) : undefined,
          to: tarikh_akhir ? new Date(String(tarikh_akhir)) : undefined,
        }
      : undefined
  );

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

  const DEWAN_OPTIONS: OptionType[] = DEWANS.map((key: string) => ({
    label: t(key.replace("-", "_"), { ns: "common" }),
    value: key,
  }));

  const PARTY_OPTIONS: OptionType[] = [
    { label: t(ALL_PARTIES2, { ns: "home" }), value: ALL_PARTIES2 },
  ].concat(
    PARTIES.map((key: string) => ({
      label: t(key, { ns: "party" }),
      value: key,
    }))
  );

  const AGE_OPTIONS: OptionType[] = [
    { label: t(ALL_AGES2, { ns: "demografi" }), value: ALL_AGES2 },
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

  const isTablet = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const formatDate = (date?: Date) => (!date ? "" : format(date, "yyyy-MM-dd"));

  const filteredSessions = useMemo(() => {
    return PARLIMEN_SESSIONS.filter(s =>
      (s.label as string).toLowerCase().includes(sessionSearch.toLowerCase())
    );
  }, [sessionSearch, PARLIMEN_SESSIONS]);

  const filteredSessionsMobile = useMemo(() => {
    return PARLIMEN_SESSIONS.filter(s =>
      (s.label as string)
        .toLowerCase()
        .includes(sessionSearchMobile.toLowerCase())
    );
  }, [sessionSearchMobile, PARLIMEN_SESSIONS]);

  const handleSearch = (params: Record<string, string | null>) => {
    onLoad();
    router.push(setSearchParams(router.asPath, params));
  };

  const handleClear = () => {
    handleSearch({
      uid: "",
      parti: "",
      umur: "",
      etnik: "",
      gender: "",
      tarikh_akhir: "",
      tarikh_mula: "",
    });
    setSelectedDateRange(undefined);
    setSelectedSession("");
    setData("party", ALL_PARTIES2);
    setData("age", ALL_AGES2);
    setData("etnik", ALL_ETHNICITIES);
    setData("gender", BOTH_GENDERS2);
  };

  const handleClearDateRange = () => {
    // If date exists in the current query, remove it while keeping other filters
    if (router.query.tarikh_mula || router.query.tarikh_akhir) {
      handleSearch({
        tarikh_akhir: "",
        tarikh_mula: "",
      });
    }
    setSelectedDateRange(undefined);
  };

  const className = {
    dropdown_ind_grp:
      "link p-0 border-none shadow-none active:bg-inherit active:dark:bg-inherit hover:bg-inherit hover:dark:bg-inherit",
    dropdown_demo: "text-blue-600 dark:text-primary-dark rounded-full",
  };

  return (
    <>
      <div className="space-y-6 pb-3 sm:pt-6">
        {/* Dewan Selector */}
        <div className="mx-auto hidden w-fit rounded-full border border-border bg-background p-1 md:block">
          <Tabs
            value={data.dewan}
            onValueChange={dewan => {
              setData("dewan", dewan);
              if (ind_or_grp === "individu") {
                if (data.uid)
                  handleSearch({
                    dewan,
                    uid: data.uid,
                  });
              } else if (ind_or_grp === "group")
                handleSearch({
                  dewan,
                  uid: "",
                });
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
        {ind_or_grp === "individu" ? (
          <>
            <div className="mx-auto w-full md:w-[500px]">
              <ComboBox
                placeholder={t("search_individual")}
                options={INDIVIDU_OPTIONS}
                selected={INDIVIDU_OPTIONS.find(e =>
                  data.individu_option
                    ? e.value === data.individu_option.value
                    : undefined
                )}
                dropdown={
                  <div className="flex self-center pl-4.5">
                    <Dropdown
                      className={className.dropdown_ind_grp}
                      width="w-fit"
                      options={INDIVIDU_OR_GROUP}
                      selected={INDIVIDU_OR_GROUP.find(
                        e => e.value === ind_or_grp
                      )}
                      onChange={(e: { value: string }) => {
                        onFilter(e.value);
                        if (e.value === "individu") handleClear();
                        else if (e.value === "group") {
                          setData("uid", "");
                          setData("individu_option", undefined);
                        }
                      }}
                    />
                  </div>
                }
                onChange={selected => {
                  setData("individu_option", selected);
                  if (selected) {
                    setData("uid", selected.value);
                    handleSearch({
                      uid: selected.value,
                      dewan: data.dewan,
                    });
                  }
                }}
              />
            </div>
            <div className="hidden justify-center gap-2 md:flex">
              <Select
                size="small"
                variant="outline"
                value={selectedSession}
                onValueChange={(value: string) => {
                  setSelectedSession(value);
                  setSessionSearch("");
                  const [from, to] = value.split("_");
                  const newRange = { from: new Date(from), to: new Date(to) };
                  setSelectedDateRange(newRange);
                  if (data.uid)
                    handleSearch({ tarikh_mula: from, tarikh_akhir: to });
                }}
              >
                <SelectTrigger className="text-blue-600 focus:border-blue-600 focus:ring-2 dark:text-primary-dark">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("parliament_calendar", { ns: "demografi" }) + ":"}
                  </span>
                  <SelectValue
                    placeholder={
                      <span className="font-medium text-blue-600 dark:text-primary-dark">
                        {t("semua", { ns: "common" })}
                      </span>
                    }
                    icon={HeroChevronDown}
                  >
                    {(val: string | string[]) =>
                      val && !Array.isArray(val) && val !== "" ? (
                        <span className="text-blue-600 dark:text-primary-dark">
                          {PARLIMEN_SESSIONS.find(s => s.value === val)?.label}
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-primary-dark">
                          {t("semua", { ns: "common" })}
                        </span>
                      )
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="select-item-black">
                  <SelectHeader>
                    <div
                      className="relative"
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        ref={sessionSearchRef}
                        autoFocus
                        value={sessionSearch}
                        onChange={e => {
                          const cursorPosition = e.target.selectionStart;
                          flushSync(() => setSessionSearch(e.target.value));
                          if (sessionSearchRef.current) {
                            sessionSearchRef.current.focus();
                            if (cursorPosition !== null)
                              sessionSearchRef.current.setSelectionRange(
                                cursorPosition,
                                cursorPosition
                              );
                          }
                        }}
                        onKeyDown={e => e.stopPropagation()}
                        placeholder={t("placeholder.search_session", {
                          ns: "common",
                        })}
                        className="w-full rounded border border-zinc-200 py-1.5 pl-2 pr-7 text-xs outline-none focus:border-blue-600 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                      <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </SelectHeader>
                  {filteredSessions.map(session => (
                    <SelectItem key={session.value} value={session.value}>
                      <span className="flex flex-col">
                        <span>{session.label}</span>
                        {session.label2 && (
                          <span className="text-xs text-zinc-400">
                            {session.label2}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Daterange
                className="text-txt-primary"
                placeholder={t("semua", { ns: "common" })}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                onChange={dateRange => {
                  setSelectedDateRange(dateRange);
                  setSelectedSession("");
                  if (data.uid && dateRange && dateRange?.from && dateRange?.to)
                    handleSearch({
                      tarikh_mula: formatDate(dateRange.from),
                      tarikh_akhir: formatDate(dateRange.to),
                    });
                }}
                numberOfMonths={isTablet ? 2 : 1}
              />
              {selectedDateRange && (
                <Button
                  variant="ghost"
                  className="w-fit justify-center"
                  onClick={handleClearDateRange}
                >
                  <XMarkIcon className="size-4.5" />
                  {t("clear", { ns: "common" })}
                </Button>
              )}
            </div>

            {/* Mobile Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto shadow-button md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="w-4.5 rounded-md bg-blue-600 text-center leading-5 text-white dark:bg-primary-dark">
                    2
                  </span>
                  <ChevronDownIcon className="-mx-[5px] size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between border-b border-slate-200 dark:border-zinc-700">
                  <span className="font-semibold text-foreground">
                    {t("filters", { ns: "common" }) + ":"}
                  </span>
                  <DrawerClose />
                </DrawerHeader>
                <div className="flex flex-col divide-y bg-background px-4 dark:divide-zinc-800">
                  <div className="space-y-1 py-3">
                    <Label
                      label={
                        t("parliament_calendar", { ns: "demografi" }) + ":"
                      }
                    />
                    <Select
                      size="small"
                      variant="outline"
                      value={selectedSession}
                      onValueChange={(value: string) => {
                        setSelectedSession(value);
                        setSessionSearchMobile("");
                        const [from, to] = value.split("_");
                        setSelectedDateRange({
                          from: new Date(from),
                          to: new Date(to),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full justify-between text-foreground">
                        <SelectValue
                          placeholder={t("semua", { ns: "common" })}
                          icon={HeroChevronDown}
                        >
                          {(val: string | string[]) =>
                            val && !Array.isArray(val) && val !== ""
                              ? PARLIMEN_SESSIONS.find(s => s.value === val)
                                  ?.label
                              : t("semua", { ns: "common" })
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="select-item-black">
                        <SelectHeader>
                          <div
                            className="relative"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                          >
                            <input
                              ref={sessionSearchMobileRef}
                              autoFocus
                              value={sessionSearchMobile}
                              onChange={e => {
                                const cursorPosition = e.target.selectionStart;
                                flushSync(() =>
                                  setSessionSearchMobile(e.target.value)
                                );
                                if (sessionSearchMobileRef.current) {
                                  sessionSearchMobileRef.current.focus();
                                  if (cursorPosition !== null)
                                    sessionSearchMobileRef.current.setSelectionRange(
                                      cursorPosition,
                                      cursorPosition
                                    );
                                }
                              }}
                              onKeyDown={e => e.stopPropagation()}
                              placeholder={t("placeholder.search_session", {
                                ns: "common",
                              })}
                              className="w-full rounded border border-zinc-200 py-1.5 pl-2 pr-7 text-xs outline-none focus:border-blue-600 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          </div>
                        </SelectHeader>
                        {filteredSessionsMobile.map(session => (
                          <SelectItem key={session.value} value={session.value}>
                            <span className="flex flex-col">
                              <span>{session.label}</span>
                              {session.label2 && (
                                <span className="text-xs text-zinc-400">
                                  {session.label2}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 py-3">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
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
                      placeholder={t("semua", { ns: "common" })}
                      selected={selectedDateRange}
                      onChange={dateRange => {
                        setSelectedDateRange(dateRange);
                        setSelectedSession("");
                      }}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      handleSearch({
                        uid: data.uid,
                        dewan: data.dewan,
                        tarikh_mula: formatDate(selectedDateRange?.from),
                        tarikh_akhir: formatDate(selectedDateRange?.to),
                      });
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
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
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex w-full justify-between rounded-full border border-otl-gray-200 py-2 pl-4.5 pr-1.5 md:w-fit">
              <div className="flex self-center">
                <Dropdown
                  className={className.dropdown_ind_grp}
                  width="w-fit"
                  options={INDIVIDU_OR_GROUP}
                  selected={INDIVIDU_OR_GROUP.find(e => e.value === ind_or_grp)}
                  onChange={(e: { value: string }) => {
                    onFilter(e.value);
                    handleClear();
                  }}
                />
              </div>
              <div className="hidden gap-x-1 px-2.5 md:flex">
                {/*
                    TODO: Party filter is temporarily disabled due to a requirement conflict.
                    The filter cannot be applied uniformly across all parliamentary sittings
                    because Dewan Negara senators are not affiliated with political parties,
                    making party-based filtering inapplicable for that chamber. A chamber-aware
                    implementation (i.e. showing the party filter only when Dewan Rakyat or
                    Kamar Khas is selected, and hiding it for Dewan Negara) is needed before
                    re-enabling this.
                */}
                {/* <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  enableFlag
                  flag={party => {
                    if (party === ALL_PARTIES2) return <></>;
                    else
                      return <PartyFlag party={party} children={() => true} />;
                  }}
                  options={PARTY_OPTIONS}
                  selected={PARTY_OPTIONS.find(e => e.value === data.party)}
                  onChange={e => setData("party", e.value)}
                /> */}
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={GENDER_OPTIONS}
                  selected={GENDER_OPTIONS.find(e => e.value === data.gender)}
                  onChange={e => setData("gender", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  showDisclaimer
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find(e => e.value === data.age)}
                  onChange={e => setData("age", e.value)}
                />
                {/* <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={ETNIK_OPTIONS}
                  selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
                  onChange={e => setData("etnik", e.value)}
                /> */}
                {(data.party !== ALL_PARTIES2 ||
                  data.gender !== BOTH_GENDERS2 ||
                  data.age !== ALL_AGES2 ||
                  data.etnik !== ALL_ETHNICITIES) && (
                  <Button
                    variant="ghost"
                    className="group flex justify-center rounded-full p-0 sm:-mr-1.5 sm:h-8 sm:w-8"
                    onClick={handleClear}
                  >
                    <XMarkIcon className="size-5 text-zinc-500 group-hover:text-foreground" />
                  </Button>
                )}
              </div>
              <div className="self-center">
                <Button
                  variant="primary"
                  className="h-9 rounded-full"
                  onClick={() =>
                    handleSearch({
                      uid: "",
                      dewan: data.dewan,
                      parti: data.party !== ALL_PARTIES2 ? data.party : "",
                      gender: data.gender !== BOTH_GENDERS2 ? data.gender : "",
                      umur: data.age !== ALL_AGES2 ? data.age : "",
                      etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                      tarikh_mula: formatDate(selectedDateRange?.from),
                      tarikh_akhir: formatDate(selectedDateRange?.to),
                    })
                  }
                >
                  <MagnifyingGlassIcon className="size-5 text-white" />
                  {t("placeholder.search", { ns: "common" })}
                </Button>
              </div>
            </div>

            <div className="hidden flex-wrap justify-center gap-2 md:flex">
              <Select
                size="small"
                variant="outline"
                value={selectedSession}
                onValueChange={(value: string) => {
                  setSelectedSession(value);
                  setSessionSearch("");
                  const [from, to] = value.split("_");
                  setSelectedDateRange({
                    from: new Date(from),
                    to: new Date(to),
                  });
                }}
              >
                <SelectTrigger className="text-blue-600 focus:border-blue-600 focus:ring-2 dark:text-primary-dark">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("parliament_calendar", { ns: "demografi" }) + ":"}
                  </span>
                  <SelectValue
                    placeholder={
                      <span className="font-medium text-blue-600 dark:text-primary-dark">
                        {t("semua", { ns: "common" })}
                      </span>
                    }
                    icon={HeroChevronDown}
                  >
                    {(val: string | string[]) =>
                      val && !Array.isArray(val) && val !== "" ? (
                        <span className="text-blue-600 dark:text-primary-dark">
                          {PARLIMEN_SESSIONS.find(s => s.value === val)?.label}
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-primary-dark">
                          {t("semua", { ns: "common" })}
                        </span>
                      )
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="select-item-black">
                  <SelectHeader>
                    <div
                      className="relative"
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        ref={sessionSearchRef}
                        autoFocus
                        value={sessionSearch}
                        onChange={e => {
                          const cursorPosition = e.target.selectionStart;
                          flushSync(() => setSessionSearch(e.target.value));
                          if (sessionSearchRef.current) {
                            sessionSearchRef.current.focus();
                            if (cursorPosition !== null)
                              sessionSearchRef.current.setSelectionRange(
                                cursorPosition,
                                cursorPosition
                              );
                          }
                        }}
                        onKeyDown={e => e.stopPropagation()}
                        placeholder={t("placeholder.search_session", {
                          ns: "common",
                        })}
                        className="w-full rounded border border-zinc-200 py-1.5 pl-2 pr-7 text-xs outline-none focus:border-blue-600 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                      <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </SelectHeader>
                  {filteredSessions.map(session => (
                    <SelectItem key={session.value} value={session.value}>
                      <span className="flex flex-col">
                        <span>{session.label}</span>
                        {session.label2 && (
                          <span className="text-xs text-zinc-400">
                            {session.label2}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Daterange
                className="text-blue-600 dark:text-primary-dark"
                placeholder={t("semua", { ns: "common" })}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                onChange={dateRange => {
                  setSelectedDateRange(dateRange);
                  setSelectedSession("");
                }}
              />

              {selectedDateRange && (
                <Button
                  variant="ghost"
                  className="w-fit justify-center"
                  onClick={handleClearDateRange}
                >
                  <XMarkIcon className="size-4.5" />
                  {t("clear", { ns: "common" })}
                </Button>
              )}
            </div>

            {/* Mobile Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto shadow-button md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="w-4.5 rounded-md bg-blue-600 text-center leading-5 text-white dark:bg-primary-dark">
                    6
                  </span>
                  <ChevronDownIcon className="-mx-[5px] size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between border-b border-slate-200 dark:border-zinc-700">
                  <span className="font-semibold text-foreground">
                    {t("filters", { ns: "common" }) + ":"}
                  </span>
                  <DrawerClose />
                </DrawerHeader>
                <div className="flex flex-col divide-y bg-background px-4 dark:divide-zinc-800">
                  <div className="space-y-1 py-3">
                    <Label
                      label={
                        t("parliament_calendar", { ns: "demografi" }) + ":"
                      }
                    />
                    <Select
                      size="small"
                      variant="outline"
                      value={selectedSession}
                      onValueChange={(value: string) => {
                        setSelectedSession(value);
                        setSessionSearchMobile("");
                        const [from, to] = value.split("_");
                        setSelectedDateRange({
                          from: new Date(from),
                          to: new Date(to),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full justify-between text-foreground">
                        <SelectValue
                          placeholder={t("semua", { ns: "common" })}
                          icon={HeroChevronDown}
                        >
                          {(val: string | string[]) =>
                            val && !Array.isArray(val) && val !== ""
                              ? PARLIMEN_SESSIONS.find(s => s.value === val)
                                  ?.label
                              : t("semua", { ns: "common" })
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="select-item-black">
                        <SelectHeader>
                          <div
                            className="relative"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                          >
                            <input
                              ref={sessionSearchMobileRef}
                              autoFocus
                              value={sessionSearchMobile}
                              onChange={e => {
                                const cursorPosition = e.target.selectionStart;
                                flushSync(() =>
                                  setSessionSearchMobile(e.target.value)
                                );
                                if (sessionSearchMobileRef.current) {
                                  sessionSearchMobileRef.current.focus();
                                  if (cursorPosition !== null)
                                    sessionSearchMobileRef.current.setSelectionRange(
                                      cursorPosition,
                                      cursorPosition
                                    );
                                }
                              }}
                              onKeyDown={e => e.stopPropagation()}
                              placeholder={t("placeholder.search_session", {
                                ns: "common",
                              })}
                              className="w-full rounded border border-zinc-200 py-1.5 pl-2 pr-7 text-xs outline-none focus:border-blue-600 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          </div>
                        </SelectHeader>
                        {filteredSessionsMobile.map(session => (
                          <SelectItem key={session.value} value={session.value}>
                            <span className="flex flex-col">
                              <span>{session.label}</span>
                              {session.label2 && (
                                <span className="text-xs text-zinc-400">
                                  {session.label2}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 py-3">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
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
                      placeholder={t("semua", { ns: "common" })}
                      selected={selectedDateRange}
                      onChange={dateRange => {
                        setSelectedDateRange(dateRange);
                        setSelectedSession("");
                      }}
                    />
                  </div>

                  <div className="w-full space-y-1 py-3">
                    <Label label={t("party", { ns: "common" }) + ":"} />
                    <Dropdown
                      enableFlag
                      flag={party => {
                        if (party === ALL_PARTIES2) return <></>;
                        else
                          return (
                            <PartyFlag party={party} children={() => true} />
                          );
                      }}
                      anchor="left"
                      options={PARTY_OPTIONS}
                      selected={PARTY_OPTIONS.find(e => e.value === data.party)}
                      onChange={e => setData("party", e.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-3">
                    <div className="w-full space-y-1">
                      <Label label={t("age", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        anchor="left bottom-10"
                        showDisclaimer
                        options={AGE_OPTIONS}
                        selected={AGE_OPTIONS.find(e => e.value === data.age)}
                        onChange={e => setData("age", e.value)}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Label label={t("gender", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        options={GENDER_OPTIONS}
                        selected={GENDER_OPTIONS.find(
                          e => e.value === data.gender
                        )}
                        onChange={e => setData("gender", e.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full space-y-1 py-3">
                    <Label label={t("ethnicity", { ns: "demografi" }) + ":"} />
                    <Dropdown
                      anchor="left bottom-10"
                      options={ETNIK_OPTIONS}
                      selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
                      onChange={e => setData("etnik", e.value)}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      handleSearch({
                        uid: "",
                        dewan: data.dewan,
                        parti: data.party !== ALL_PARTIES2 ? data.party : "",
                        gender:
                          data.gender !== BOTH_GENDERS2 ? data.gender : "",
                        umur: data.age !== ALL_AGES2 ? data.age : "",
                        etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
                        tarikh_mula: formatDate(selectedDateRange?.from),
                        tarikh_akhir: formatDate(selectedDateRange?.to),
                      });
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
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
          </div>
        )}
      </div>
    </>
  );
};

export default MPFilter;
