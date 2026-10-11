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

function matchesQuery(haystack: string, q: string): boolean {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#010409] dark:text-slate-100">
      <a
        href="#commands"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to commands
      </a>

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#0d1117] text-white print:bg-white print:text-black">
        <div aria-hidden="true" className="print-hidden pointer-events-none absolute inset-0">
          <div className="hero-orb absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
          <div
            className="hero-orb absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl"
            style={{ animationDelay: "-7s" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_8px_30px_-6px_rgba(139,92,246,0.7)] sm:flex"
              >
                <svg viewBox="0 0 16 16" className="h-7 w-7 text-white" fill="currentColor">
                  <path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM5.5 4.5a.75.75 0 0 0-1.061 1.06l2.72 2.72-2.72 2.72a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06Zm4.75.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.75-.75Z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs text-slate-400">
                  <span aria-hidden="true" className="text-emerald-400">$ </span>git help
                  --daily-reference
                </p>
                <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
                  GitHub Commands{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    Cheat Sheet
                  </span>
                </h1>
                <p className="mt-2 max-w-2xl text-[15px] text-slate-400">
                  The commands you actually use, searchable in milliseconds. Fast, beautiful, and
                  fully offline.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print or download as PDF"
                className="print-hidden inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 active:scale-95"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path d="M3.5 1.75a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.25 0h-8.5A1.75 1.75 0 0 0 2 1.75v9.5c0 .966.784 1.75 1.75 1.75h1v1.5c0 .138.112.25.25.25h6a.25.25 0 0 0 .25-.25V13h1c.966 0 1.75-.784 1.75-1.75v-5a.75.75 0 0 0-1.5 0v5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25Z" />
                  <path d="M6 11.5a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v1.75a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75Z" />
                </svg>
                Print / PDF
              </button>
            </div>
          </div>

          <dl className="flex flex-wrap gap-2.5" aria-label="Cheat sheet statistics">
            {[
              [`${COMMANDS.length}`, "commands"],
              [`${CATEGORIES.length}`, "categories"],
              [`${WORKFLOWS.length}`, "workflows"],
              ["100%", "offline"],
            ].map(([num, label]) => (
              <div
                key={label}
                className="flex items-baseline gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur"
              >
                <dt className="sr-only">{label}</dt>
                <dd aria-hidden="true" className="font-mono text-lg font-bold text-white">
                  {num}
                </dd>
                <dd aria-hidden="true" className="text-xs text-slate-400">
                  {label}
                </dd>
                <span className="sr-only">
                  {num} {label}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── Sticky toolbar ───────────────────────────────── */}
      <div className="print-hidden sticky top-0 z-20 border-b border-slate-200/80 bg-slate-100/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#010409]/85">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
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
            <div className="min-w-0 flex-1">
              <CategoryNav
                selected={category}
                onSelect={setCategory}
                counts={counts}
                favoritesCount={favoriteIds.length}
                totalCount={COMMANDS.length}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by difficulty">
            <span className="mr-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Level
            </span>
            {DIFFICULTY_OPTIONS.map((opt) =>
              opt === "all" ? (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDifficulty(opt)}
                  aria-pressed={difficulty === opt}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all active:scale-95 ${
                    difficulty === opt
                      ? "bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900"
                      : "text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
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
                  className={`rounded-full p-0.5 transition-all active:scale-95 ${
                    difficulty === opt ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <DifficultyBadge level={opt} />
                </button>
              ),
            )}
            <a
              href="#workflows"
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Common workflows
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <main id="commands" className="mx-auto max-w-6xl scroll-mt-40 px-4 py-8 sm:px-6">
        {showFavoritesView ? (
          <section aria-label="Favorite commands">
            <SectionHeading
              title="Your favorites"
              glyph="★"
              blurb="Your starred commands, saved in this browser."
            />
            <FavoritesView
              favorites={favoriteCommands}
              categoriesById={categoriesById}
              query={debouncedQuery}
              onToggleFavorite={toggleFavorite}
              onBrowseAll={() => setCategory("all")}
            />
          </section>
        ) : grouped ? (
          <div className="flex flex-col gap-12">
            {grouped.map(({ category: cat, commands }) => (
              <section key={cat.id} aria-label={cat.name} id={`cat-${cat.id}`} className="scroll-mt-40">
                <SectionHeading
                  title={cat.name}
                  count={commands.length}
                  blurb={cat.description}
                  color={cat.color}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 p-10 text-center sm:p-14 dark:border-white/15">
            <p aria-hidden="true" className="font-mono text-5xl text-slate-300 dark:text-slate-700">
              {"~/ ∅"}
            </p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">No commands match</h2>
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
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(99,102,241,0.8)] transition-all hover:brightness-110 active:scale-95"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <section aria-label="Filtered commands">
            <SectionHeading
              title={
                debouncedQuery ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "Commands"
              }
              blurb={
                debouncedQuery ? `Matching “${debouncedQuery}”` : "Filtered by your selection."
              }
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        <section id="workflows" aria-label="Common workflows" className="mt-16 scroll-mt-40">
          <SectionHeading
            title="Common workflows"
            glyph="⚡"
            blurb="Step-by-step recipes for the situations developers hit every week."
          />
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {WORKFLOWS.map((w) => (
              <WorkflowCard key={w.id} workflow={w} />
            ))}
          </div>
        </section>
      </main>

      <footer className="print-hidden mt-8 border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-7 text-xs text-slate-500 sm:px-6 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              GitHub Commands Cheat Sheet
            </span>
            <span aria-hidden="true">·</span>
            <span>Static, offline, no tracking.</span>
          </div>
          <p className="flex items-center gap-1.5">
            Shortcuts:
            <kbd className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/15 dark:bg-white/5">
              /
            </kbd>
            search
            <kbd className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/15 dark:bg-white/5">
              Esc
            </kbd>
            clear
          </p>
          <p className="font-mono text-[11px]">git push --set-upstream origin main</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  title,
  blurb,
  count,
  color,
  glyph,
}: {
  title: string;
  blurb?: string;
  count?: number;
  color?: string;
  glyph?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        {color && (
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-[4px]"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 2px 10px ${color}55` }}
          />
        )}
        {glyph && (
          <span aria-hidden="true" className="text-indigo-500 dark:text-indigo-400">
            {glyph}
          </span>
        )}
        {title}
        {typeof count === "number" && (
          <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {count}
          </span>
        )}
      </h2>
      {blurb && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{blurb}</p>}
    </div>
  );
}
