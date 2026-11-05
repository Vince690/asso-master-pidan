import type { Metadata } from "next";
import { Suspense } from "react";
import Backdrop from "@/components/site/Backdrop";
import { AdminMobileBar, AdminSidebar } from "@/components/admin/AdminNav";
import UserBadge from "@/components/admin/UserBadge";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Admin PID@N" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const account = (
    <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-white/5" />}>
      <UserBadge />
    </Suspense>
  );
  return (
    <>
      <Backdrop />
      <div className="relative z-10 flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
        <aside className="glass flex shrink-0 flex-col gap-6 border-r border-line p-5 max-md:hidden md:sticky md:top-0 md:h-screen md:w-64 md:rounded-none">
          <Suspense fallback={null}>
            <AdminSidebar account={account} />
          </Suspense>
        </aside>
        <Suspense fallback={null}>
          <AdminMobileBar account={account} />
        </Suspense>
        <main className="min-w-0 flex-1 px-5 py-8 max-md:px-4 max-md:pt-24 max-md:pb-8 md:overflow-y-auto md:px-10 md:py-10">{children}</main>
      </div>
    </>
  );
}
