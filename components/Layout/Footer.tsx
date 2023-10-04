import { At, Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import Image from "next/image";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Container background="bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 max-sm:px-3 pt-12 pb-16 z-10">
      <div className="flex w-full max-md:flex-col max-md:gap-8 md:justify-between">
        <div className="flex gap-4">
          {/* LOGO */}
          <div className="mt-1 w-12">
            <Image
              src="/static/images/jata_logo.png"
              width={48}
              height={36}
              alt="jata negara"
            />
          </div>
          <div>
            <div className="mb-2 font-bold uppercase">
              {t("footer.parlimen")}
            </div>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} {t("footer.parlimen")}
            </p>
          </div>
        </div>
        <div className="flex gap-x-6 lg:gap-x-8 text-sm">
          {/* OPEN SOURCE CODE */}
          <div className="flex w-full flex-col gap-y-3 md:w-[200px]">
            <p className="font-bold">{t("footer.open_source")}</p>

            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.frontend")}
            </At>
            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.backend")}
            </At>
            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.parser")}
            </At>
            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.ui_ux")}
            </At>
          </div>

          {/* OPEN SOURCE DATA */}
          <div className="flex w-full flex-col gap-y-3 md:w-[200px]">
            <p className="font-bold">{t("footer.open_data")}</p>

            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.guiding_principles")}
            </At>
            <At className="link-dim" scrollTop={false} href="#">
              {t("footer.terms_of_use")}
            </At>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
