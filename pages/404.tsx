import Metadata from "@components/Metadata";
import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ArrowBackIcon } from "@govtechmy/myds-react/icon";
import { Link } from "@govtechmy/myds-react/link";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps } from "next";

const Error404: Page = () => {
  const { t } = useTranslation("error");

  return (
    <>
      <Metadata title={t("404.title") as string} keywords={""} />

      <main className="flex min-h-[90vh] flex-col space-y-6 pt-40 text-center">
        <p className="font-poppins text-[100px] leading-[100px] text-bg-black-400">
          404
        </p>
        <div className="space-y-4">
          <h2 className="font-poppins text-heading-xs font-semibold md:text-heading-sm">
            Halaman tidak dijumpai
          </h2>
          <div>
            {["Page not found", "页面未找到", "பக்கம் காணப்படவில்லை"].map(
              error => (
                <p className="text-lg text-txt-black-700">{error}</p>
              )
            )}
          </div>
        </div>
        <Button variant="default-outline" size="small" asChild>
          <Link href="/" underline="none" className="mx-auto mt-10">
            <ButtonIcon>
              <ArrowBackIcon />
            </ButtonIcon>
            Kembali ke Halaman Utama
          </Link>
        </Button>
      </main>
    </>
  );
};

export default Error404;

export const getStaticProps: GetStaticProps = withi18n("error", async () => {
  return {
    props: {
      meta: {
        id: "error-400",
        type: "misc",
      },
    },
  };
});
