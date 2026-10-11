import type { Category, GitCommand } from "../data/commands";
import { CommandCard } from "./CommandCard";

interface FavoritesViewProps {
  favorites: GitCommand[];
  categoriesById: Map<string, Category>;
  query: string;
  onToggleFavorite: (id: string) => void;
  onBrowseAll: () => void;
}

export function FavoritesView({ favorites, categoriesById, query, onToggleFavorite, onBrowseAll }: FavoritesViewProps) {
  if (favorites.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 p-10 text-center sm:p-14 dark:border-white/15 dark:bg-white/[0.02]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl"
        />
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.7)]">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-6 w-6 text-white" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
        </div>
        <h2 className="relative mt-4 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          No favorites yet
        </h2>
        <p className="relative mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Star the commands you reach for every day and they will live here — saved in your browser,
          available offline.
        </p>
        <button
          type="button"
          onClick={onBrowseAll}
          className="relative mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(99,102,241,0.8)] transition-all hover:brightness-110 active:scale-95"
        >
          Browse all commands
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {favorites.map((cmd) => {
        const category = categoriesById.get(cmd.category);
        if (!category) return null;
        return (
          <CommandCard
            key={cmd.id}
            cmd={cmd}
            category={category}
            query={query}
            isFavorite
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}
