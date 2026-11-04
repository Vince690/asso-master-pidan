import { Suspense } from "react";
import Backdrop from "@/components/site/Backdrop";
import CharGrid from "@/components/site/CharGrid";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <Backdrop />
      <CharGrid />
      {/* usePathname dans le header : doit être sous Suspense au-dessus des routes dynamiques */}
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="relative z-10 flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
