import type { Metadata } from "next";
import { Suspense } from "react";
import Backdrop from "@/components/site/Backdrop";
import AdminNav from "@/components/admin/AdminNav";
import UserBadge from "@/components/admin/UserBadge";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Admin PID@N" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <Backdrop />
      <div className="relative z-10 flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
        <aside className="glass flex shrink-0 flex-col gap-6 border-r border-line p-5 max-md:sticky max-md:top-0 max-md:z-30 max-md:rounded-none max-md:border-r-0 max-md:border-b max-md:p-0 md:sticky md:top-0 md:h-screen md:w-64 md:rounded-none">
          <Suspense fallback={null}>
            <AdminNav
              account={
                <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-white/5" />}>
                  <UserBadge />
                </Suspense>
              }
            />
          </Suspense>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 max-md:px-4 max-md:py-6 md:overflow-y-auto md:px-10 md:py-10">{children}</main>
      </div>
    </>
  );
}
