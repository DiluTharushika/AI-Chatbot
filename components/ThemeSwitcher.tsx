"use client";

import { useEffect, useState } from "react";

const THEMES = ["default", "ocean", "rose"] as const;
type Theme = (typeof THEMES)[number];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("default");
  const [mounted, setMounted] = useState(false);

  function applyTheme(t: Theme) {
    if (typeof document === "undefined") return;
    if (t === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", t);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const saved = (localStorage.getItem("theme") as Theme) || "default";
      setTheme(saved);
      applyTheme(saved);
    }, 0);
  }, []);

  if (!mounted) return <div className="w-20 h-8" />; // Placeholder to avoid hydration mismatch

  function onChange(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[rgb(var(--muted))]">Theme</span>
      <select
        className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-1 text-sm text-[rgb(var(--text))]"
        value={theme}
        onChange={(e) => onChange(e.target.value as Theme)}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}