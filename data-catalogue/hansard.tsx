import Hero from "@components/Hero";
import { Container, DateCard, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import SpeechBubble, { SpeechBubbleProps } from "./bubble";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

/**
 * Hansard
 * @overview Status: In-development
 */

interface HansardProps {
  date: string;
  filename: string;
  cite_count: number;
  download_count: number;
  view_count: number;
  speeches: string;
}

const Hansard = ({
  date,
  filename,
  cite_count,
  download_count,
  view_count,
  speeches,
}: HansardProps) => {
  const { t } = useTranslation(["common", "enum", "hansard"]);

  const TERM = 15;
  const SESSION = 2;
  const MEETING = 0;

  const VIEWS = 1_000_000;
  const SHARES = 1_000;
  const DLS = 1_000;

  const MESSAGES: SpeechBubbleProps[] = [
    {
      position: "right",
      party: "ydp",
      speaker: {
        name: "Tuan Yang di-Pertua",
        designation: "",
      },
      speech: "Baik, sabar-sabar.",
    },
    {
      position: "left",
      party: "ph",
      speaker: {
        name: "Dr. Mohammed Taufiq bin Johari",
        designation: "Sungai Petani",
      },
      speech: "Putrajaya, duduk!",
    },
    {
      position: "left",
      party: "pn",
      speaker: {
        name: "Datuk Dr. Radzi bin Jidin",
        designation: "Putrajaya",
      },
      speech: "Tarik balik! Tarik balik! Tarik balik!",
    },
    {
      position: "right",
      party: "ydp",
      speaker: {
        name: "Tuan Yang di-Pertua",
        designation: "",
      },
      speech: "Sabar.",
    },
    {
      position: "left",
      party: "pn",
      speaker: {
        name: "Datuk Dr. Radzi bin Jidin",
        designation: "Putrajaya",
      },
      speech: `Tuan Yang di-Pertua! Tuan Yang di-Pertua!
      Tarik balik! Tarik balik! Tarik balik! Tarik balik! Tarik balik! Tarik balik!`,
    },
  ];

  return (
    <>
      <Hero background="gold">
        <div>
          <div className="space-y-6 py-12 xl:w-full">
            <span className="flex items-center font-medium text-sm text-zinc-500 underline [text-underline-position:from-font]">
              {t("archive", { ns: "hansard", context: "dewan_rakyat" })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500"/>
              {t("term_full", { ns: "enum", n: TERM })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500"/>
              {t("session_full", { ns: "enum", n: SESSION })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500"/>
              {t("meeting_full", { ns: "enum", n: MEETING })}
            </span>
            <div className="flex justify-between gap-3 lg:gap-6 items-center">
              <DateCard size="lg" date={date} />
              <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                <h2 className="text-zinc-900" data-testid="hero-header">
                  {t("hero.header")}
                </h2>
                <p
                className="text-zinc-500 flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap"
                data-testid="hero-views"
              >
                <span>{`${numFormat(view_count, "compact")} ${t("views", {
                  count: view_count,
                })}`}</span>
                •
                <span>{`${numFormat(SHARES, "compact")} ${t("shares", {
                  count: SHARES,
                })}`}</span>
                •
                <span>{`${numFormat(download_count, "compact")} ${t(
                  "downloads",
                  {
                    count: download_count,
                  }
                )}`}</span>
              </p>
              </div>
            </div>

            <div className="space-y-3">
              
            </div>
          </div>
        </div>
      </Hero>

      <Container>
        <Section>
          <div className="p-6 lg:p-8 flex flex-col gap-y-3 lg:gap-y-6 bg-slate-50 dark:bg-zinc-950 lg:w-3/4 xl:w-4/5">
            <p className="text-zinc-900 dark:text-white text-center italic">
              Mesyuarat dimulakan pada pukul 10:00 pagi.
            </p>
            {MESSAGES.map((m) => (
              <SpeechBubble
                party={m.party}
                position={m.position}
                speaker={m.speaker}
                speech={m.speech}
              />
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default Hansard;
