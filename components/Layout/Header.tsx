import Container from "@components/Container";
import Nav from "@components/Nav";
import { useTranslation } from "@hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation();

  return (
    <div className="dark:border-zinc-800 fixed left-0 top-0 z-30 w-full border-b h-14">
      <Container
        background="bg-white dark:bg-zinc-900"
        className="flex items-center gap-4 py-[11px]"
      >
        <div className="flex w-full items-center gap-1 lg:gap-4">
          <Link href="/">
            <div className="flex gap-2.5">
              <div className="flex w-7 h-7 items-center justify-center">
                <Image src="/static/images/logo.png" width={108} height={109} alt="datagovmy_logo" />
              </div>
              <div className="header whitespace-nowrap">Hansard Parlimen</div>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {(close) => (
              <>
                <Nav.Item
                  key={"/"}
                  title={t("nav.home")}
                  link="/"
                  onClick={close}
                />
                <Nav.Item
                  key="/kehadiran"
                  title={t("nav.kehadiran")}
                  link="/kehadiran/dewan-rakyat"
                  onClick={close}
                />
                <Nav.Item
                  key="/sejarah"
                  title={t("nav.sejarah")}
                  link="/sejarah/individu"
                  onClick={close}
                />
                <Nav.Item
                  key="/katalog"
                  title={t("nav.katalog")}
                  link="/katalog/dewan-rakyat"
                  onClick={close}
                />
              </>
            )}
          </Nav>
        </div>
      </Container>
    </div>
  );
};

export default Header;
