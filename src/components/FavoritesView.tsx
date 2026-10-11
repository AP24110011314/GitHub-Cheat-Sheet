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
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
        <p className="text-2xl" aria-hidden="true">☆</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">No favorites yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Star the commands you reach for every day and they will live here — saved in your browser,
          available offline.
        </p>
        <button
          type="button"
          onClick={onBrowseAll}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse all commands
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
