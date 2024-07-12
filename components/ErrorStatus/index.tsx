import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import useConfig from "next/config";

interface ErrorStatusProps {
  title: string;
  description?: string | null;
  code: number;
  reason: string;
}

const ErrorStatus: FunctionComponent<ErrorStatusProps> = ({
  title,
  description,
  code,
  reason,
}) => {
  const { t } = useTranslation("error");
  const {
    publicRuntimeConfig: { APP_NAME },
  } = useConfig();

  return (
    <>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col-reverse items-end justify-between gap-6 lg:flex-row">
          <div className="space-y-2">
            <h1 className="font-poppins text-xl font-bold text-foreground lg:text-3xl">
              {title}
            </h1>
            {description && <p className="text-zinc-500">{description}</p>}
          </div>
          <h2 className="text-7xl text-zinc-500">{code}</h2>
        </div>
        <div>
          <p className="pb-2 text-sm font-bold uppercase text-zinc-500 dark:text-white">
            {t("output")}
          </p>
          <div className="rounded-xl bg-slate-100 dark:bg-[#121212]">
            <div className="p-4.5 font-mono text-sm text-foreground">
              <span className="font-bold text-green-600">{APP_NAME}:~/ $</span>{" "}
              cat {code}
              -error.log
              <br />
              {reason}
              <br />
              <span className="font-bold text-green-600">{APP_NAME}:~/ $</span>
            </div>
          </div>

          <small className="text-xs text-zinc-500 dark:text-white">
            <i>{t("disclaimer")}</i>
          </small>
        </div>
      </div>
    </>
  );
};

export default ErrorStatus;
