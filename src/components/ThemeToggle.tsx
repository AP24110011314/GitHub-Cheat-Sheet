import { Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";
import { ICON_STROKE } from "./categoryIcons";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className="print-hidden inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] shadow-sm transition-all duration-300 active:scale-95"
      style={{
        /* Smooth 300ms transition between modes — skipped when prefers-reduced-motion */
        transition:
          "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <span
        key={theme}
        className="star-pop inline-flex text-[var(--accent)]"
        aria-hidden="true"
      >
        {dark ? (
          <Sun size={16} strokeWidth={ICON_STROKE} />
        ) : (
          <Moon size={16} strokeWidth={ICON_STROKE} />
        )}
      </span>
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
