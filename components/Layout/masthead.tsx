import { GovMyIcon, Lock2Icon, LockFillIcon } from "@govtechmy/myds-react/icon";
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from "@govtechmy/myds-react/masthead";
import { useTranslation } from "react-i18next";

export default function MastHead() {
  const { t } = useTranslation();

  return (
    <Masthead className="*:max-w-screen-2xl">
      <MastheadHeader className="flex items-center gap-2 px-4.5 py-2 outline-none sm:py-1 xl:px-6">
        <MastheadTitle className="max-w-full">
          {t("masthead.official_gov_website")}
        </MastheadTitle>
        <MastheadTrigger>{t("masthead.how_to_identify")}</MastheadTrigger>
      </MastheadHeader>
      <MastheadContent>
        <MastheadSection icon={<GovMyIcon />} title={t("masthead.official")}>
          {t("masthead.not_govmy")}
          <b>.gov.my</b>
          {t("masthead.close_site")}
        </MastheadSection>
        <MastheadSection icon={<Lock2Icon />} title={t("masthead.secure")}>
          {t("masthead.find_lock")}
          <LockFillIcon className="inline-block" />
          {t("masthead.or")}
          <b>https://</b>
          {t("masthead.precaution")}
        </MastheadSection>
      </MastheadContent>
    </Masthead>
  );
}
