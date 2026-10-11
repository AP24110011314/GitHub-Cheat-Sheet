import { Star } from "lucide-react";
import type { Category, GitCommand } from "../data/commands";
import { ICON_STROKE } from "./categoryIcons";
import { CommandCard } from "./CommandCard";

interface FavoritesViewProps {
  favorites: GitCommand[];
  categoriesById: Map<string, Category>;
  query: string;
  onToggleFavorite: (id: string) => void;
  onBrowseAll: () => void;
  onCopied?: (message: string) => void;
}

export function FavoritesView({
  favorites,
  categoriesById,
  query,
  onToggleFavorite,
  onBrowseAll,
  onCopied,
}: FavoritesViewProps) {
  if (favorites.length === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-dashed p-6 text-center sm:p-10 lg:p-14"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          boxShadow: "0 2px 8px -2px var(--shadow-color)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-44 w-80 max-w-full -translate-x-1/2 rounded-full blur-3xl opacity-35"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--secondary))",
          }}
        >
          <Star size={24} strokeWidth={ICON_STROKE} aria-hidden="true" fill="currentColor" />
        </div>
        <h2 className="relative mt-4 text-lg font-bold tracking-tight text-[var(--text)]">
          No favorites yet
        </h2>
        <p className="relative mx-auto mt-1 max-w-sm text-sm text-[var(--muted)]">
          Star the commands you reach for every day and they will live here — saved in your browser,
          available offline.
        </p>
        <button
          type="button"
          onClick={onBrowseAll}
          className="relative mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            boxShadow: "0 4px 14px -2px color-mix(in srgb, var(--accent) 55%, transparent)",
          }}
        >
          Browse all commands
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
            onCopied={onCopied}
          />
        );
      })}
    </div>
  );
}
