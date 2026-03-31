"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  FileText,
  User,
  Mail,
  ArrowLeftRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutGrid, label: "Home" },
  { href: "/admin/projects", icon: Building2, label: "Projects" },
  { href: "/admin/blogs", icon: FileText, label: "Blog" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/profile", icon: User, label: "Profile" },
  { href: "/", icon: ArrowLeftRight, label: "Switch" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : href === "/"
                ? false
                : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary dark:text-white"
                  : "text-muted hover:text-primary dark:hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
