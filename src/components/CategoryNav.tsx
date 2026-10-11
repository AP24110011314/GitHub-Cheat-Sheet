import { Star } from "lucide-react";
import type { CSSProperties } from "react";
import type { CategoryId } from "../data/commands";
import { CATEGORIES } from "../data/commands";
import { CATEGORY_ICONS, ICON_STROKE } from "./categoryIcons";

export type CategoryFilter = CategoryId | "all" | "favorites";

interface CategoryNavProps {
  selected: CategoryFilter;
  onSelect: (next: CategoryFilter) => void;
  counts: Record<string, number>;
  favoritesCount: number;
  totalCount: number;
}

export function CategoryNav({
  selected,
  onSelect,
  counts,
  favoritesCount,
  totalCount,
}: CategoryNavProps) {
  const base =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95";

  /**
   * Active tab: solid amber fill (#DB9558) with very dark text so contrast is AA.
   * Hover (inactive): amber border + faint amber tint background.
   * Inactive: card surface + border + muted text.
   */
  const pillStyle = (isActive: boolean): CSSProperties =>
    isActive
      ? {
          borderColor: "transparent",
          backgroundColor: "var(--accent)",
          color: "var(--page)",            // dark forest green on amber = high contrast
          boxShadow: "0 0 12px color-mix(in srgb, var(--accent) 35%, transparent)",
        }
      : {
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          color: "var(--muted)",
        };

  const countStyle = (isActive: boolean): CSSProperties =>
    isActive
      ? {
          backgroundColor: "rgba(18, 23, 15, 0.25)",  // dark forest tint
          color: "var(--page)",
        }
      : {
          backgroundColor: "var(--raised)",
          color: "var(--muted)",
        };

  return (
    <nav
      aria-label="Command categories"
      className="print-hidden no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {/* All */}
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={base}
        style={pillStyle(selected === "all")}
      >
        All
        <span
          className="rounded-full px-1.5 text-[11px] font-bold"
          style={countStyle(selected === "all")}
        >
          {totalCount}
        </span>
      </button>

      {/* Favorites */}
      <button
        type="button"
        onClick={() => onSelect("favorites")}
        aria-pressed={selected === "favorites"}
        className={base}
        style={pillStyle(selected === "favorites")}
      >
        <Star
          size={13}
          strokeWidth={ICON_STROKE}
          aria-hidden="true"
          fill={selected === "favorites" ? "currentColor" : "none"}
        />
        Favorites
        <span
          className="rounded-full px-1.5 text-[11px] font-bold"
          style={countStyle(selected === "favorites")}
        >
          {favoritesCount}
        </span>
      </button>

      {/* Category pills */}
      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.id];
        const isActive = selected === c.id;


        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            aria-pressed={isActive}
            className={base}
            style={pillStyle(isActive)}
          >
            {/* Icon: dark (isActive) mode = page green; inactive = sage or amber per palette */}
            <Icon
              size={13}
              strokeWidth={ICON_STROKE}
              aria-hidden="true"
              color={isActive ? "var(--page)" : `var(--secondary)`}
            />
            {c.name}
            <span
              className="rounded-full px-1.5 text-[11px] font-bold"
              style={countStyle(isActive)}
            >
              {counts[c.id] ?? 0}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
