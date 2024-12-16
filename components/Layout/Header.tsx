import Container from "@components/Container";
import Nav from "@components/Nav";
import { useTranslation } from "@hooks/useTranslation";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header = ({ stateSelector }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 top-0 z-30 h-14 w-screen border-b dark:border-zinc-800">
      <Container
        background="bg-background"
        className="flex items-center gap-4 py-[11px]"
      >
        <div className="flex w-full items-center gap-1 lg:gap-4">
          <Link href="/">
            <div className="flex items-center gap-2.5">
              <div className="flex w-8 items-center justify-center">
                <ParlimenIcon />
              </div>
              <div className="header whitespace-nowrap">Hansard Parlimen</div>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {close =>
              process.env.NEXT_PUBLIC_APP_ENV !== "production" && (
                <>
                  <Nav.Item
                    key="/"
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
              )
            }
          </Nav>
        </div>
      </Container>
    </div>
  );
};

export default Header;

const ParlimenIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" {...props}>
      <circle cx="500.5" cy="500.1" r="437.9" fill="#110c42" />
      <g fill="#b49b1a">
        <path d="M500.5 39.2c254.5 0 460.9 206.4 460.9 460.9S755 961 500.5 961 39.6 754.6 39.6 500.1C39.6 245.5 246 39.2 500.5 39.2zm437.9 460.9c0-241.8-196-437.9-437.9-437.9S62.6 258.3 62.6 500.1 258.6 938 500.5 938s437.9-196.1 437.9-437.9zm-664.9 350l30.4-55.4 16.7 9.2-10.6 43.3 30.7-32.3 16.8 9.2-30.5 55.4-10.4-5.7 24-43.6-35 37.6-10.8-5.9 13-49.6-24 43.6-10.3-5.8zM399.8 905l-13.2-4.3-.7-15.4-24-7.9-9.5 12-12.9-4.2 43.2-52.3 12.8 4.2 4.3 67.9zm-14.5-31.1l-.9-25-15.5 19.6 16.4 5.4zm27.7 33.4l10.1-61.9 12.6 2.1-8.4 51.4 31.3 5.1-1.7 10.5-43.9-7.2zm116.1 9l-13.9-.1-5.4-14.4-25.3-.2-5.3 14.3-13.5-.1 25.1-63 13.5.1 24.8 63.4zm-23.3-25.2l-8.5-23.5-8.7 23.4 17.2.1zm44 22.1l-3.5-26.4-27.8-33.2 14.8-2 18.1 22.8 11.1-26.7 14.6-2-18.1 39.5 3.5 26.3-12.7 1.7zm38.9-26.7l11.6-4.7c1.9 3.8 4.2 6.3 7 7.5 2.7 1.2 6 1.3 9.7.2 3.9-1.2 6.7-2.9 8.2-5.2s1.9-4.5 1.3-6.7c-.4-1.4-1.2-2.5-2.4-3.3s-2.9-1.2-5.2-1.3c-1.6-.1-5.1 0-10.6.3-7 .3-12.2-.3-15.6-1.9-4.7-2.2-7.8-5.7-9.2-10.5-.9-3.1-.9-6.2 0-9.4s2.9-6 5.7-8.4c2.9-2.4 6.6-4.3 11.3-5.7 7.6-2.3 13.8-2.3 18.7-.1 4.8 2.2 8.2 6 10 11.5l-12.1 4.2c-1.5-3-3.2-4.9-5.4-5.7-2.1-.8-4.9-.8-8.4.3-3.6 1.1-6.1 2.6-7.7 4.7-1 1.3-1.3 2.8-.8 4.3.4 1.4 1.4 2.5 2.9 3.1 1.9.8 6.1 1.1 12.4.7 6.4-.4 11.2-.2 14.5.4 3.3.7 6.1 2 8.5 4.2 2.4 2.1 4.2 5.1 5.3 8.9 1 3.5 1 7 0 10.6s-3.1 6.7-6.2 9.2-7.3 4.6-12.5 6.1c-7.7 2.3-14.1 2.3-19.2 0s-9-6.8-11.8-13.3zm68.7-1l-24.7-58.2 11.7-5 24.7 58.2-11.7 5zm76.8-39.8l-12.1 6.9-11.9-9.7-21.9 12.5 2.6 15.1-11.8 6.7-10-67.1 11.7-6.7 53.4 42.3zm-32.8-10l-19.2-16 4.2 24.6 15-8.6zM278.1 239.6l-41.9-57.2 18.5-13.6c7-5.1 11.8-8.2 14.4-9.2 3.9-1.5 8-1.7 12.3-.4s8.1 4.2 11.5 8.7c2.6 3.5 4.1 6.9 4.6 10.3.5 3.3.2 6.4-.7 9.2-1 2.8-2.3 5.2-4 7.1-2.4 2.6-6.1 5.8-11.4 9.6l-7.5 5.5 15.8 21.6-11.6 8.4zm-23.3-55.9l11.9 16.2 6.3-4.6c4.6-3.3 7.4-5.9 8.5-7.6s1.6-3.5 1.6-5.5c-.1-1.9-.7-3.7-2-5.4-1.5-2.1-3.4-3.3-5.6-3.8s-4.4-.2-6.5.9c-1.6.8-4.4 2.7-8.6 5.7l-5.6 4.1zm126.1-5.5l-14 6.9-12.7-11.7-25.4 12.6 1.9 17-13.6 6.7-6.7-75.8 13.6-6.7 56.9 51zm-36.1-13.5l-20.4-19.3 3.1 27.8 17.3-8.5zm40.9 12.4l-18-68.6 29.1-7.7c7.3-1.9 12.8-2.7 16.5-2.4 3.6.4 6.9 1.9 9.7 4.5s4.8 6 5.8 10c1.4 5.1 1 9.8-1.2 13.9-2.1 4.1-6.1 7.5-11.9 9.9 3.5 1 6.4 2.2 8.9 3.8s6.1 4.6 10.8 9.1l11.9 11.2-16.6 4.4-13.9-12.3c-5-4.4-8.3-7.1-10-8.2-1.7-1-3.3-1.6-4.9-1.8-1.6-.1-4 .2-7.2 1.1l-2.8.7 7.5 28.6-13.7 3.8zm3.5-43.2l10.2-2.7c6.6-1.7 10.7-3.1 12.2-4.1s2.5-2.3 3.1-3.9.6-3.5.1-5.5c-.6-2.3-1.7-4-3.3-5.1s-3.6-1.5-5.9-1.3c-1.2.1-4.6.9-10.2 2.4l-10.8 2.8 4.6 17.4zm63.9 27.2L448 90.9l14.3-1 4.2 58.2 35.5-2.6.9 11.9-49.8 3.7zm58-2.4l3.6-70.8 14.3.7-3.6 70.8-14.3-.7zm25.8.1l14.4-69.4 21 4.4 2.7 50L597.3 99l21 4.4-14.4 69.4-13-2.7 11.4-54.7-25.2 51.8-13.5-2.8-2.4-57.5-11.4 54.7-12.9-2.8zm77.6 18.2l28.6-64.9 48.1 21.2-4.8 11-35-15.4-6.3 14.4 32.6 14.3-4.8 10.9-32.6-14.3-7.8 17.7 36.3 16-4.8 10.9-49.5-21.8zm57.8 26.4l40.6-58.2 11.4 8-3.3 55.4 27.1-38.8 10.9 7.6-40.6 58.2-11.8-8.2 3-54.3-26.4 37.9-10.9-7.6z" />
        <path d="M892.5 691.8l-4.3 17.2h-25.8l-12.9 25.8h-99.1l-17.2-30.2h-34.5l-15 18-8.7-7.2v-10.8h-5.8v10.8h-9.3v-10.8H654v10.8h-9.3v-10.8h-5.8v10.8h-9.4v-10.8h-5.8v10.8h-9.4v-10.8h-5.8v10.8h-9.4v-10.8h-5.8v10.8H584v-10.8h-5.8v10.8h-9.3v-10.8H563v10.8l-7.8 3.9-7.3-14.6H397.1v17.2l-4.3 8.6H130.1l-6.5-8.6h260.6v-17.2H112.8l-4.3-12.9h784zm-54 23.6v-10.8h-5.8v10.8h5.8zm-15.2 0v-10.8h-5.8v10.8h5.8zm-15.2 0v-10.8h-5.8v10.8h5.8zm-15.2 0v-10.8h-5.8v10.8h5.8zm-15.1 0v-10.8H772v10.8h5.8zm-15.2 0v-10.8h-5.8v10.8h5.8zm9.3 49.6h60.3v17.2h-60.3zm-94.8-17.2h77.5v34.5h-77.5z" />
        <path d="M683.7 722.7l-6.6 7.8H560.8l-5.6-11.2 7.8-3.9h5.8 9.3 5.8 9.4 5.8 9.4 5.8 9.4 5.7 9.4 5.8 9.4 5.8 9.3 5.9zm-23.8 25.1V778l-501.8-4.3-8.6-12.9h45.2v-12.9h-53.8l-6.5-8.6h258.4v-8.6l4.3-8.6H410l4.3-4.3H479l17.2 21.5 64 3.4 99.7 5.1zm-262.8 12.9v-12.9H377v12.9h20.1zm-36.6 0v-12.9h-9.3v12.9h9.3zm-23.2 0v-12.9H328v12.9h9.3zm-23.2 0v-12.9h-9.3v12.9h9.3zm-23.2 0v-12.9h-9.3v12.9h9.3zm-23.3 0v-12.9h-9.3v12.9h9.3zm-23.2 0v-12.9h-9.3v12.9h9.3zm-23.2 0v-12.9h-9.3v12.9h9.3zm450.5-77.5l-53.8-129.3L564 683.2h-16.1l70-168 70 168zm-53.8-103.4l-16.2 38.7H634zm-9.7 99.1l.3-45.3-28.3 45.3zm19.6 0l-.2-45.3 28.2 45.3zm112.4-116l5.5 20.4-8.5-2.5-5.7-21.3h0l-10.6-4.2h0l6.1 22.6-8.5-2.5-6.3-23.5h0l-10.6-4.2h0l6.6 24.7-8.4-2.4-6.9-25.7h0l-10.5-4.1h.1l7.2 26.8-8.5-2.4-7.4-27.8h0l-15.3-6h0l7.9 29.5-8.4-2.5-8.2-30.4h0l-20.1-7.9 68.9 163.7h86.2l-34.5-116.3z" />
        <path d="M539.3 261.5l21.5 7.6v-21l-73.2-25.8-155.1 34.4v21l155.1-34.4 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21l155.1-34.5 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21L487.6 319l38.8 13.6-.1 16.8-38.7-13.6-155.1 34.4v21l155.1-34.4 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21l155.1-34.5 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21l155.1-34.4 38.8 13.6-.1 16.9-38.7-13.7-155.1 34.4v21.1l155.1-34.5 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21l155.1-34.5 38.8 13.7-.1 16.8-38.7-13.7-155.1 34.5v21L487.6 546l38.7 13.6.1 16.9-38.8-13.7-155.1 34.4v21.1l155.1-34.5 38.7 13.7.1 16.8-38.8-13.7-155.1 34.5v21l155.1-34.5 38.7 13.7.1 16.8-38.8-13.7-155.1 34.5v21l155.1-34.4 73.2 25.8v-21l-21.5-7.6v-16.8l21.5 7.6v-21l-21.7-7.7.2-16.8 21.5 7.6v-21l-21.5-7.6v-16.8l21.5 7.6v-21l-21.7-7.7.2-16.7 21.5 7.6v-21l-21.5-7.6v-16.9l21.5 7.6v-21l-21.7-7.7.2-16.7 21.5 7.6v-21l-21.5-7.6v-16.8l21.5 7.6v-21.1l-21.5-7.6V375l21.5 7.6v-21l-21.5-7.6v-16.8l21.5 7.6v-21l-21.5-7.6v-16.8l21.5 7.6v-21.1l-21.5-7.6z" />
      </g>
    </svg>
  );
};
