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
      className="print-hidden inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] shadow-sm backdrop-blur transition-all duration-200 hover:bg-[var(--hover)] active:scale-95"
    >
      <span key={theme} className="star-pop inline-flex text-[var(--accent)]" aria-hidden="true">
        {dark ? <Sun size={16} strokeWidth={ICON_STROKE} /> : <Moon size={16} strokeWidth={ICON_STROKE} />}
      </span>
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
