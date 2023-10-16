import Hero from "@components/Hero";
import { Container, DateCard, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import SpeechBubble, { SpeechBubbleProps } from "./bubble";

/**
 * Hansard
 * @overview Status: In-development
 */

const Hansard = () => {
  const { t } = useTranslation(["common", "enum", "hansard"]);

  const DATE = "2023-09-19";
  const TERM = 15;
  const SESSION = 2;
  const MEETING = 0;
  const BIL = 737;

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
            <div className="flex justify-between gap-3 lg:gap-6 items-center">
              <DateCard size="lg" date={DATE} />
              <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                <span
                  className="font-semibold text-secondary"
                  data-testid="hero-category"
                >
                  {t("term", { ns: "enum", count: TERM })}
                  {" / "}
                  {t("session", { ns: "enum", n: SESSION })}
                  {" / "}
                  {t("meeting", { ns: "enum", n: MEETING })}
                  {" / "}
                  {t("bil", { ns: "enum", count: BIL })}
                </span>
                <h2 className="text-zinc-900" data-testid="hero-header">
                  {t("hero.header")}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <p
                className="text-zinc-500 flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap"
                data-testid="hero-views"
              >
                <span>{`${numFormat(VIEWS, "compact")} ${t("views", {
                  count: VIEWS,
                })}`}</span>
                •
                <span>{`${numFormat(SHARES, "compact")} ${t("shares", {
                  count: SHARES,
                })}`}</span>
                •
                <span>{`${numFormat(DLS, "compact")} ${t("downloads", {
                  count: DLS,
                })}`}</span>
              </p>
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
