import type { CategoryId } from "../data/commands";
import { CATEGORIES } from "../data/commands";

export type CategoryFilter = CategoryId | "all" | "favorites";

interface CategoryNavProps {
  selected: CategoryFilter;
  onSelect: (next: CategoryFilter) => void;
  counts: Record<string, number>;
  favoritesCount: number;
  totalCount: number;
}

export function CategoryNav({ selected, onSelect, counts, favoritesCount, totalCount }: CategoryNavProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95";
  const idle =
    "border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:-translate-y-px hover:border-indigo-300 hover:text-slate-900 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white";
  const active =
    "border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.6)]";

  return (
    <nav aria-label="Command categories" className="print-hidden flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={`${base} ${selected === "all" ? active : idle}`}
      >
        All
        <span
          className={`rounded-full px-1.5 text-[11px] font-semibold ${
            selected === "all" ? "bg-white/25" : "bg-slate-100 dark:bg-white/10"
          }`}
        >
          {totalCount}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelect("favorites")}
        aria-pressed={selected === "favorites"}
        className={`${base} ${selected === "favorites" ? active : idle}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3 w-3"
          fill={selected === "favorites" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
        Favorites
        <span
          className={`rounded-full px-1.5 text-[11px] font-semibold ${
            selected === "favorites" ? "bg-white/25" : "bg-slate-100 dark:bg-white/10"
          }`}
        >
          {favoritesCount}
        </span>
      </button>
      {CATEGORIES.map((c) => {
        const isActive = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            aria-pressed={isActive}
            className={`${base} ${isActive ? active : idle}`}
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: isActive ? "#fff" : c.color }}
            />
            {c.name}
            <span
              className={`rounded-full px-1.5 text-[11px] font-semibold ${
                isActive ? "bg-white/25" : "bg-slate-100 dark:bg-white/10"
              }`}
            >
              {counts[c.id] ?? 0}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
