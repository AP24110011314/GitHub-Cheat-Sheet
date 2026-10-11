import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryNav, type CategoryFilter } from "./components/CategoryNav";
import { CommandCard } from "./components/CommandCard";
import { DifficultyBadge } from "./components/DifficultyBadge";
import { FavoritesView } from "./components/FavoritesView";
import { SearchBar } from "./components/SearchBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { WorkflowCard } from "./components/WorkflowCard";
import { CATEGORIES, COMMANDS, type Difficulty } from "./data/commands";
import { WORKFLOWS } from "./data/workflows";
import { useDebounce } from "./hooks/useDebounce";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";

type DifficultyFilter = Difficulty | "all";

const DIFFICULTY_OPTIONS: DifficultyFilter[] = ["all", "Beginner", "Intermediate", "Advanced"];

function matchesQuery(
  haystack: string,
  q: string,
): boolean {
  return haystack.toLowerCase().includes(q);
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>("gh-cheatsheet-favorites", []);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const debouncedQuery = useDebounce(query, 150).trim().toLowerCase();

  const categoriesById = useMemo(() => new Map(CATEGORIES.map((c) => [c.id, c])), []);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  // Keyboard shortcuts: `/` focuses search, `Esc` clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target !== null && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cmd of COMMANDS) map[cmd.category] = (map[cmd.category] ?? 0) + 1;
    return map;
  }, []);

  const filtered = useMemo(() => {
    return COMMANDS.filter((cmd) => {
      if (category === "favorites" && !favoriteSet.has(cmd.id)) return false;
      if (category !== "all" && category !== "favorites" && cmd.category !== category) return false;
      if (difficulty !== "all" && cmd.difficulty !== difficulty) return false;
      if (!debouncedQuery) return true;
      const catName = categoriesById.get(cmd.category)?.name ?? "";
      return (
        matchesQuery(cmd.command, debouncedQuery) ||
        matchesQuery(cmd.description, debouncedQuery) ||
        matchesQuery(cmd.example, debouncedQuery) ||
        matchesQuery(catName, debouncedQuery) ||
        cmd.keywords.some((k) => matchesQuery(k, debouncedQuery))
      );
    });
  }, [category, difficulty, debouncedQuery, favoriteSet, categoriesById]);

  const favoriteCommands = useMemo(
    () => COMMANDS.filter((c) => favoriteSet.has(c.id)),
    [favoriteSet],
  );

  const grouped = useMemo(() => {
    if (category !== "all" || debouncedQuery || difficulty !== "all") return null;
    return CATEGORIES.map((c) => ({
      category: c,
      commands: COMMANDS.filter((cmd) => cmd.category === c.id),
    })).filter((g) => g.commands.length > 0);
  }, [category, debouncedQuery, difficulty]);

  const showFavoritesView = category === "favorites" && !debouncedQuery && difficulty === "all";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#commands"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to commands
      </a>

      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">$ </span>git help --daily-reference
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                GitHub Commands Cheat Sheet
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {COMMANDS.length} commands · {CATEGORIES.length} categories · {WORKFLOWS.length} workflows.
                Fast, searchable, and fully offline.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print or download as PDF"
                className="print-hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span aria-hidden="true">⎙</span> Print / PDF
              </button>
            </div>
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
            inputRef={searchRef}
            resultCount={filtered.length}
            totalCount={COMMANDS.length}
          />

          <div className="flex flex-wrap items-center gap-2">
            <CategoryNav
              selected={category}
              onSelect={setCategory}
              counts={counts}
              favoritesCount={favoriteIds.length}
              totalCount={COMMANDS.length}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by difficulty">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Level:</span>
            {DIFFICULTY_OPTIONS.map((opt) =>
              opt === "all" ? (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDifficulty(opt)}
                  aria-pressed={difficulty === opt}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    difficulty === opt
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  All levels
                </button>
              ) : (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDifficulty(opt)}
                  aria-pressed={difficulty === opt}
                  className={`rounded-full border px-2 py-1 ${
                    difficulty === opt
                      ? "border-slate-900 ring-2 ring-slate-900/20 dark:border-white"
                      : "border-transparent"
                  }`}
                >
                  <DifficultyBadge level={opt} />
                </button>
              ),
            )}
            <a
              href="#workflows"
              className="ml-auto text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Jump to common workflows ↓
            </a>
          </div>
        </div>
      </header>

      <main id="commands" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-8 sm:px-6">
        {showFavoritesView ? (
          <section aria-label="Favorite commands">
            <h2 className="mb-3 text-lg font-semibold">★ Your favorites</h2>
            <FavoritesView
              favorites={favoriteCommands}
              categoriesById={categoriesById}
              query={debouncedQuery}
              onToggleFavorite={toggleFavorite}
              onBrowseAll={() => setCategory("all")}
            />
          </section>
        ) : grouped ? (
          <div className="flex flex-col gap-10">
            {grouped.map(({ category: cat, commands }) => (
              <section key={cat.id} aria-label={cat.name}>
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      {commands.length}
                    </span>
                  </h2>
                </div>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {commands.map((cmd) => (
                    <CommandCard
                      key={cmd.id}
                      cmd={cmd}
                      category={cat}
                      query=""
                      isFavorite={favoriteSet.has(cmd.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <h2 className="text-lg font-semibold">No commands match</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Try a different keyword, category, or level — e.g. “rebase”, “stash”, or “gh pr”.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setDifficulty("all");
              }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <section aria-label="Filtered commands">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((cmd) => {
                const cat = categoriesById.get(cmd.category);
                if (!cat) return null;
                return (
                  <CommandCard
                    key={cmd.id}
                    cmd={cmd}
                    category={cat}
                    query={debouncedQuery}
                    isFavorite={favoriteSet.has(cmd.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              })}
            </div>
          </section>
        )}

        <section id="workflows" aria-label="Common workflows" className="mt-14 scroll-mt-4">
          <h2 className="text-xl font-bold">Common workflows</h2>
          <p className="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-300">
            Step-by-step recipes for the situations developers hit every week.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {WORKFLOWS.map((w) => (
              <WorkflowCard key={w.id} workflow={w} />
            ))}
          </div>
        </section>
      </main>

      <footer className="print-hidden border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:px-6 dark:text-slate-400">
          <p>
            GitHub Commands Cheat Sheet — static, offline, no tracking. Shortcuts:{" "}
            <kbd className="rounded border border-slate-300 px-1 dark:border-slate-700">/</kbd> search,{" "}
            <kbd className="rounded border border-slate-300 px-1 dark:border-slate-700">Esc</kbd> clear.
          </p>
          <p className="font-mono">git push --set-upstream origin main ✨</p>
        </div>
      </footer>
    </div>
  );
}
