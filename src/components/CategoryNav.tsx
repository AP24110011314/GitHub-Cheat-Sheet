import { Star } from "lucide-react";
import type { CSSProperties } from "react";
import type { CategoryId } from "../data/commands";
import { CATEGORIES } from "../data/commands";
import { CATEGORY_ICONS, CATEGORY_PALETTE, ICON_STROKE } from "./categoryIcons";

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
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95";

  const pillStyle = (isActive: boolean): CSSProperties =>
    isActive
      ? {
          borderColor: "transparent",
          background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          color: "#ffffff",
          boxShadow: "0 4px 12px -2px color-mix(in srgb, var(--accent) 55%, transparent)",
        }
      : {
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          color: "var(--muted)",
        };

  const countStyle = (isActive: boolean): CSSProperties =>
    isActive
      ? { backgroundColor: "rgba(255, 255, 255, 0.28)", color: "#ffffff" }
      : { backgroundColor: "var(--hover)", color: "var(--muted)" };

  return (
    <nav
      aria-label="Command categories"
      className="print-hidden no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={base}
        style={pillStyle(selected === "all")}
      >
        All
        <span
          className="rounded-full px-1.5 py-0.2 text-[11px] font-semibold"
          style={countStyle(selected === "all")}
        >
          {totalCount}
        </span>
      </button>

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
          className="rounded-full px-1.5 py-0.2 text-[11px] font-semibold"
          style={countStyle(selected === "favorites")}
        >
          {favoritesCount}
        </span>
      </button>

      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.id];
        const isActive = selected === c.id;
        const iconColor = isActive ? "#ffffff" : CATEGORY_PALETTE[c.id].light;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            aria-pressed={isActive}
            className={base}
            style={pillStyle(isActive)}
          >
            <Icon
              size={13}
              strokeWidth={ICON_STROKE}
              aria-hidden="true"
              color={iconColor}
            />
            {c.name}
            <span
              className="rounded-full px-1.5 py-0.2 text-[11px] font-semibold"
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
