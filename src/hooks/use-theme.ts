import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "black" | "light";

const STORAGE_KEY = "theme";
const EVENT_NAME = "adna-theme-change";

function readStored(): Theme {
  if (typeof window === "undefined") return "light";

  const v = localStorage.getItem(STORAGE_KEY);

  if (v === "black") return "black";
  if (v === "light") return "light";

  return "dark";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  root.classList.remove("dark", "black", "light");

  switch (t) {
    case "black":
      root.classList.add("black");
      root.setAttribute("data-theme", "premium-dark");
      break;

    case "light":
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      break;

    default:
      root.classList.add("dark");
      root.setAttribute("data-theme", "classic");
      break;
  }
}

export function syncThemeFromStorage() {
  applyTheme(readStored());
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored);

  useEffect(() => {
    applyTheme(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const handler = () => {
      const next = readStored();

      setThemeState((prev) => (prev === next ? prev : next));

      applyTheme(next);
    };

    window.addEventListener("storage", handler);
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("focus", handler);

    document.addEventListener("visibilitychange", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("focus", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);

    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}

    applyTheme(t);

    try {
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    const current = readStored();

    if (current === "dark") {
      setTheme("black");
    } else if (current === "black") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
