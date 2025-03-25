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

interface ExcerptListItemProps {
  dewan: Dewan;
  excerpt: Excerpt;
  keyword: string;
}

const ExcerptListItem = ({ dewan, excerpt, keyword }: ExcerptListItemProps) => {
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
      // href={`hansard/${dewan}/${sitting.date}?search=${keyword}#${index}`}
      prefetch={false}
      className="group p-3 first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 sm:p-4"
    >
      <div className="relative flex h-full flex-col gap-1">
        <p className="line-clamp-1 text-body-sm font-medium">{speaker}</p>
        <div className="line-clamp-2 text-body-xs text-txt-black-700 sm:text-body-sm">
          {md.render(trimmed_speech)}
        </div>
      </div>
    </Link>
  );
};

export default ExcerptListItem;
