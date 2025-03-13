import { useTranslation } from "@hooks/useTranslation";
import {
  Footer,
  FooterTopSection,
  FooterMainInfo,
  ImageWithTitle,
  Address,
  SocialMedia,
  SocialMediaItem,
  FooterContent,
  FooterContentColumn,
  FooterBottomSection,
  FooterCopyright,
  FooterCopyrightDate,
  FooterTimestamp,
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
    <Footer className="max-w-screen-2xl *:max-lg:mx-0">
      <FooterTopSection>
        <FooterMainInfo>
          <ImageWithTitle
            imgSrc="/static/images/jata_logo.png"
            imgAlt="Jata Negara"
          >
            {t("footer.parlimen")}
          </ImageWithTitle>
          <Address>
            Bangunan Parlimen,{"\n"}
            Jalan Parlimen,{"\n"}
            50680, Kuala Lumpur
          </Address>
          <SocialMedia title="Follow Us">
            {social_media.map(({ icon, name, href }) => (
              <SocialMediaItem key={name} icon={icon} href={href} name={name} />
            ))}
          </SocialMedia>
        </FooterMainInfo>
        {/* <FooterContent>
          <FooterContentColumn title={"Open Source"}>
            {open_source.map(({ name, href }) => (
              <Link
                key={name}
                newTab
                href={href}
                underline="hover"
                className="hover:text-txt-black-900"
              >
                {t("footer." + name)}
              </Link>
            ))}
          </FooterContentColumn>
        </FooterContent> */}
      </FooterTopSection>
      <FooterBottomSection>
        <FooterCopyright>
          <FooterCopyrightDate>All Rights Reserved</FooterCopyrightDate>
        </FooterCopyright>
        {/* <FooterTimestamp time=""></FooterTimestamp> */}
      </FooterBottomSection>
    </Footer>
  );
};

export default FooterLayout;
