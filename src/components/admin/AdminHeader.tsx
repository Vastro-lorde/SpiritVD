"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Project",
  "/admin/blogs": "Blogs",
  "/admin/profile": "Profile",
  "/admin/change-password": "Change Password",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-white px-4 dark:border-border-dark dark:bg-surface-dark">
      <h1 className="text-lg font-bold text-primary dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
          <Image
            src="/placeholder-avatar.png"
            alt="Admin"
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-primary dark:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-14 z-50 w-48 rounded-lg border border-border bg-white py-1 shadow-lg dark:border-border-dark dark:bg-surface-dark">
          <Link
            href="/admin/change-password"
            onClick={() => setMenuOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm text-primary hover:bg-primary/5 dark:text-white dark:hover:bg-white/5"
          >
            Change Password
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
