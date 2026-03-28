import AdminHeader from "@/components/admin/AdminHeader";
import BottomNav from "@/components/admin/BottomNav";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col bg-gray-50 text-primary dark:bg-surface-dark dark:text-white">
        <AdminHeader />
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </div>
    </SessionProvider>
  );
}
