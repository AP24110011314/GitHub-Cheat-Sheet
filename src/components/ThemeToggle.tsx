import type { Theme } from "../hooks/useTheme";

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
      className="print-hidden inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 active:scale-95"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {dark ? "☀︎" : "☾"}
      </span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
