import { Button } from "@components/index";
import { Tag } from "@components/Tag";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { RelatedSearch } from "@lib/types";
import { capitalize } from "@lib/utils";

/**
 * Related Search Chip
 * @overview "Adakah anda maksudkan: [Ekonomi ->] (x)" shown under the search box
 * when the backend corrected a misspelled keyword.
 *
 * It only displays. It does not know about the router or the search box: the
 * parent (keyword-filter.tsx) decides what the two buttons do.
 */

interface RelatedSearchChipProps {
  relatedSearch: RelatedSearch;
  /** Arrow: put the suggestion in the search box */
  onAccept: () => void;
  /** x: search again for exactly what the user typed */
  onReject: () => void;
}

const RelatedSearchChip = ({
  relatedSearch,
  onAccept,
  onReject,
}: RelatedSearchChipProps) => {
  const { t } = useTranslation("home");
  const { corrected } = relatedSearch;

  return (
    <Tag
      variant="primary"
      mode="pill"
      size="medium"
      className="h-auto max-w-full whitespace-normal"
    >
      <ArrowPathIcon className="size-4 shrink-0" aria-hidden />
      <span>{t("did_you_mean")}</span>
      {/* The user's word is plain JSX text, never passed through t(), so a
          value like "[a](http://x)" cannot turn into a link */}
      <span className="inline-flex min-w-0 items-center gap-1 rounded-md border border-border bg-background pl-2 pr-0.5 text-foreground">
        <span className="min-w-0 break-words">{capitalize(corrected)}</span>
        <Button
          variant="ghost"
          className="size-6 shrink-0 justify-center rounded-full p-0"
          aria-label={`${t("did_you_mean_accept")}: ${corrected}`}
          onClick={onAccept}
        >
          <ArrowRightIcon className="size-4" aria-hidden />
        </Button>
      </span>
      <Button
        variant="ghost"
        className="size-6 shrink-0 justify-center rounded-full p-0"
        aria-label={t("search_exact_instead")}
        onClick={onReject}
      >
        <XMarkIcon className="size-4" aria-hidden />
      </Button>
    </Tag>
  );
};

export default RelatedSearchChip;
