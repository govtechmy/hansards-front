import DateCard from "../../../components/Card/date-card";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "@hooks/useTranslation";
import { Dewan } from "@lib/types";
import Link from "next/link";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";

export type Excerpt = {
  index: number;
  speaker: string;
  trimmed_speech: string;
  sitting: {
    date: string;
    term: number;
    session: number;
    meeting: number;
  };
};

interface ExcerptCardProps {
  dewan: Dewan;
  excerpt: Excerpt;
  keyword: string;
}

const ExcerptCard = ({ dewan, excerpt, keyword }: ExcerptCardProps) => {
  const { t } = useTranslation("enum");
  const { index, sitting, speaker, trimmed_speech } = excerpt;
  // const [name, title] = speaker.split("[");

  const md = new Remarkable();
  md.inline.ruler.enable(["mark"]);
  md.renderer = new RemarkableReactRenderer({
    components: {
      mark: ({ children }: { children: string[] }) => (
        <mark className="bg-[#DDD6B0] text-black">{children[0]}</mark>
      ),
    },
  });

  return (
    <Link
      href={`hansard/${dewan}/${sitting.date}#${index}`}
      prefetch={false}
      className="group max-w-3xl rounded-xl border border-border p-6 shadow-button hover:border-border-hover hover:bg-slate-50 dark:hover:bg-zinc-800/50"
    >
      <div className="relative flex h-full flex-col gap-3">
        <div className="flex w-auto gap-4.5">
          <DateCard date={sitting.date} size="sm" />

          <div className="flex w-[calc(100%-164px)] grow flex-col justify-evenly">
            <p className="truncate font-bold text-foreground">{speaker}</p>
            {/* <p className="text-zinc-500 font-medium truncate">
              {title ? title.slice(0, -1) : ""}
            </p> */}
          </div>
          <ArrowUpRightIcon className="hidden size-5 shrink-0 -translate-x-2 text-zinc-500 opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300 motion-reduce:transition-none sm:block" />
        </div>
        <div className="flex-grow">{md.render(trimmed_speech)}</div>
        <span className="flex gap-1 border-t pt-3 text-xs text-zinc-500 dark:border-zinc-800">
          {`${t("parlimen", {
            ordinal: true,
            count: sitting.term,
          })} / ${t("penggal_full", {
            n: sitting.session,
          })} / ${t("mesyuarat_full", {
            n: sitting.meeting,
          })}`}
        </span>
      </div>
    </Link>
  );
};

export default ExcerptCard;
