import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { ElectionResult } from "./types";

interface ResultBadgeProps {
  value: ElectionResult | undefined;
  hidden?: boolean;
}

const ResultBadge = ({ value, hidden = false }: ResultBadgeProps) => {
  const { t } = useTranslation("sejarah");
  switch (value) {
    case "won":
    case "won_uncontested":
      return <Won desc={!hidden && t(value)} />;
    case "lost":
    case "lost_deposit":
      return <Lost desc={!hidden && t(value)} />;
    default:
      return <></>;
  }
};

export default ResultBadge;

interface WonProps {
  desc?: string | false;
}

export const Won = ({ desc }: WonProps) => {
  return (
    <span className="text-emerald-500 flex gap-1.5">
      <CheckCircleIcon className="h-4 w-4 self-center" />
      {desc && <span className="whitespace-nowrap uppercase">{desc}</span>}
    </span>
  );
};

interface LostProps {
  desc?: string | false;
}

export const Lost = ({ desc }: LostProps) => {
  return (
    <span className="text-red-600 flex gap-1.5">
      <XCircleIcon className="h-4 w-4 self-center" />
      {desc && <span className="whitespace-nowrap uppercase">{desc}</span>}
    </span>
  );
};
