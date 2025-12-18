import { useTranslation } from "@hooks/useTranslation";
import {
  Footer,
  SiteInfo,
  FooterSection,
  SiteLinkGroup,
  SiteLink,
  FooterLogo,
} from "@govtechmy/myds-react/footer";
import { Link } from "@govtechmy/myds-react/link";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "@govtechmy/myds-react/icon";

const FooterLayout = () => {
  const { t } = useTranslation();

  const social_media = [
    {
      icon: <FacebookIcon />,
      name: "Facebook",
      href: "https://www.facebook.com/ParlimenMY/",
    },
    { icon: <XIcon />, name: "X", href: "https://x.com/MYParlimen" },
    {
      icon: <InstagramIcon />,
      name: "Instagram",
      href: "https://www.instagram.com/parlimenmalaysia/",
    },
    {
      icon: <YoutubeIcon />,
      name: "Youtube",
      href: "https://www.youtube.com/channel/UCu2I5HXcZudP59E5Ld10K_g",
    },
  ];

  const open_source = [
    {
      name: "frontend",
      href: "https://www.github.com/govtechmy/hansards-front",
    },
    { name: "backend", href: "https://www.github.com/govtechmy/hansards-back" },
    {
      name: "parser",
      href: "https://www.github.com/govtechmy/hansards-dataproc",
    },
    {
      name: "ui_ux",
      href: "https://www.figma.com/design/YHg0aC8rHlEaX84ZQ5FwJt/Parliament-Hansards",
    },
  ];

  return (
    <Footer>
      <FooterSection className="flex w-full flex-col justify-between gap-4 border-none text-sm text-txt-black-500 md:pb-0 md:max-lg:gap-4.5 lg:max-w-screen-2xl lg:flex-row lg:gap-6">
        <SiteInfo>
          <div className="flex items-center gap-x-2.5 whitespace-nowrap font-poppins text-body-md font-semibold text-txt-black-900">
            <FooterLogo
              logo={
                <img
                  src="/static/images/jata-negara.png"
                  width={36}
                  height={28}
                  alt="Jata Negara"
                />
              }
            />
            {t("footer.parlimen")}
          </div>
          <p className="whitespace-pre-line text-body-sm text-txt-black-700">
            Bangunan Parlimen,{"\n"}
            Jalan Parlimen,{"\n"}
            50680, Kuala Lumpur
          </p>
          <p className="text-body-sm font-semibold text-txt-black-900">
            {t("footer.follow_us")}
          </p>
          <div className="flex gap-3">
            {social_media.map(({ icon, name, href }) => (
              <Link
                key={name}
                newTab
                href={href}
                underline="hover"
                className="hover:text-txt-black-900"
              >
                {icon}
              </Link>
            ))}
          </div>
        </SiteInfo>

        {/* <SiteLinkGroup groupTitle={t("footer.open_source")}>
            {open_source.map(({ name, href }) => (
              <SiteLink
                key={name}
                newTab
                href={href}
                underline="hover"
                className="hover:text-txt-black-900"
              >
                {t("footer." + name)}
              </SiteLink>
            ))}
          </SiteLinkGroup> */}
      </FooterSection>
      <FooterSection className="flex w-full flex-col justify-between gap-4 border-none text-sm text-txt-black-500 md:pb-0 md:max-lg:gap-4.5 lg:max-w-screen-2xl lg:flex-row lg:gap-6">
        <p>
          {t("footer.all_rights_reserved")} © {new Date().getFullYear()}
        </p>
      </FooterSection>
    </Footer>
  );
};

export default FooterLayout;
