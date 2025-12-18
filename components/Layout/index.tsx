import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import { FC, ReactNode } from "react";
import dynamic from "next/dynamic";

const Masthead = dynamic(() => import("./masthead"), { ssr: false });

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ className, children, stateSelector }) => {
  return (
    <div vaul-drawer-wrapper="" className={className}>
      <Masthead />
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-grow flex-col">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
