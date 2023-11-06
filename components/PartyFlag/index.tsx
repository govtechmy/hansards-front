import { useTranslation } from "@hooks/useTranslation";
import { ImageWithFallback } from "..";
import { ReactNode } from "react";

interface PartyFlagProps {
  value: string;
  children?: ReactNode;
}

const PartyFlag = ({ value, children }: PartyFlagProps) => {
  const { t } = useTranslation("party");

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex h-5 w-8 justify-center">
        <ImageWithFallback
          className="border-slate-200 dark:border-zinc-800 rounded border"
          src={`/static/images/parties/${value}.png`}
          width={32}
          height={18}
          alt={value}
          style={{
            width: "auto",
            maxWidth: "32px",
            height: "auto",
            maxHeight: "20px",
          }}
        />
      </div>
      {children ? children : <span className="truncate">{t(value)}</span>}
    </div>
  );
};

export default PartyFlag;
