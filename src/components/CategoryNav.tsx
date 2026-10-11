import { Star } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
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
  // 44px+ tap targets via padding (min-h), scroll-snap handled in CSS.
  const base =
    "inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95";

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

  // Keep the active tab visible: scroll it into view on selection change.
  const railRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeRef.current || !railRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      activeRef.current.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    } catch {
      // scrollIntoView options unsupported — scroll position stays as-is
    }
  }, [selected]);

  const setActiveRef = (isActive: boolean) => (el: HTMLButtonElement | null) => {
    if (isActive) activeRef.current = el;
  };

  return (
    <div className="relative">
      {/* Edge fades signal the row scrolls — decorative only */}
      <span aria-hidden="true" className="rail-fade rail-fade-left rounded-l-full" />
      <span aria-hidden="true" className="rail-fade rail-fade-right rounded-r-full" />
      <nav
        ref={railRef}
        aria-label="Command categories"
        className="tab-rail no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-6 py-1"
      >
      {/* All */}
      <button
        ref={setActiveRef(selected === "all")}
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
        ref={setActiveRef(selected === "favorites")}
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
            ref={setActiveRef(isActive)}
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
    </div>
  );
}
