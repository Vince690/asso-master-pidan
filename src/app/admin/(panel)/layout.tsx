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
        <aside className="glass flex shrink-0 flex-col gap-6 border-r border-line p-5 md:sticky md:top-0 md:h-screen md:w-64 md:rounded-none">
          <Suspense fallback={null}>
            <AdminNav />
          </Suspense>
          <div className="mt-auto">
            <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-white/5" />}>
              <UserBadge />
            </Suspense>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 md:overflow-y-auto md:px-10 md:py-10">{children}</main>
      </div>
    </>
  );
}
