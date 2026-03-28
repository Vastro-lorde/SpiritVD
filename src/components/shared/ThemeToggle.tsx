"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary/5 dark:border-border-dark"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-primary" />
      ) : (
        <Moon className="h-4 w-4 text-white" />
      )}
    </button>
  );
}
