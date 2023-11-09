import { useTranslation } from "@hooks/useTranslation";
import { ImageWithFallback } from "..";
import { ReactNode } from "react";

interface PartyFlagProps {
  party: string;
  children?: ReactNode;
}

const PartyFlag = ({ party, children }: PartyFlagProps) => {
  const { t } = useTranslation("party");

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex h-5 w-8 justify-center">
        <ImageWithFallback
          className="border-slate-200 dark:border-zinc-800 rounded border"
          src={`/static/images/parties/${party}.png`}
          width={32}
          height={18}
          alt={party}
          style={{
            width: "auto",
            maxWidth: "32px",
            height: "auto",
            maxHeight: "20px",
          }}
        />
      </div>
      {children ? children : <span className="truncate">{t(party)}</span>}
    </div>
  );
};

export default PartyFlag;
