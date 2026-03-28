"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/enums";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && Object.values(Theme).includes(stored)) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme(Theme.DARK);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === Theme.DARK);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
