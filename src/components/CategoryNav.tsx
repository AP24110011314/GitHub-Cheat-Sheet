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
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors";
  const idle =
    "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white";
  const active =
    "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-600";

  return (
    <nav aria-label="Command categories" className="print-hidden flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={`${base} ${selected === "all" ? active : idle}`}
      >
        All
        <span className="rounded-full bg-black/10 px-1.5 text-[11px] dark:bg-white/20">{totalCount}</span>
      </button>
      <button
        type="button"
        onClick={() => onSelect("favorites")}
        aria-pressed={selected === "favorites"}
        className={`${base} ${selected === "favorites" ? active : idle}`}
      >
        <span aria-hidden="true">★</span> Favorites
        <span className="rounded-full bg-black/10 px-1.5 text-[11px] dark:bg-white/20">{favoritesCount}</span>
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          aria-pressed={selected === c.id}
          className={`${base} ${selected === c.id ? active : idle}`}
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          {c.name}
          <span className="rounded-full bg-black/10 px-1.5 text-[11px] dark:bg-white/20">
            {counts[c.id] ?? 0}
          </span>
        </button>
      ))}
    </nav>
  );
}
