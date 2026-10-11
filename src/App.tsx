import { ExternalLink, Funnel, RotateCcw, SearchX, Star, Workflow as WorkflowIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CategoryNav, type CategoryFilter } from "./components/CategoryNav";
import { CATEGORY_ICONS, ICON_STROKE } from "./components/categoryIcons";
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

// TODO: point this at the real repository URL after publishing.
const REPO_URL = "https://github.com/";

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
    <div className="min-h-screen bg-[var(--page)] text-[var(--text)]">
      <a
        href="#commands"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to commands
      </a>

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#0d1117] text-white print:bg-white print:text-black">
        <div aria-hidden="true" className="print-hidden pointer-events-none absolute inset-0">
          <div className="hero-orb absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#2f81f7]/25 blur-3xl" />
          <div
            className="hero-orb absolute -top-20 right-0 h-80 w-80 rounded-full bg-[#a371f7]/20 blur-3xl"
            style={{ animationDelay: "-7s" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
          <div className="hero-enter flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#3fb950]" />
              git help --daily-reference
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print or download as PDF"
                className="print-hidden hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 active:scale-95 sm:inline-flex"
              >
                Print / PDF
              </button>
            </div>
          </div>

          <div className="hero-enter mx-auto mt-8 flex max-w-2xl flex-col items-center text-center" style={{ animationDelay: "80ms" }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
              GitHub Commands{" "}
              <span className="bg-gradient-to-r from-[#79c0ff] via-[#a371f7] to-[#f778ba] bg-clip-text text-transparent">
                Cheat Sheet
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
              Every Git &amp; <span className="font-mono text-[13px] text-slate-300">gh</span> command
              worth memorizing — searchable in milliseconds, available fully offline.
            </p>
          </div>

          <div className="hero-enter mx-auto mt-6 w-full max-w-2xl" style={{ animationDelay: "160ms" }}>
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
          </div>

          <dl
            className="hero-enter mx-auto mt-5 flex flex-wrap justify-center gap-2.5"
            style={{ animationDelay: "220ms" }}
            aria-label="Cheat sheet statistics"
          >
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
      <div
        className="print-hidden sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--page) 88%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-3 sm:px-6">
          <CategoryNav
            selected={category}
            onSelect={setCategory}
            counts={counts}
            favoritesCount={favoriteIds.length}
            totalCount={COMMANDS.length}
          />
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by difficulty">
            <span
              className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase"
              style={{ color: "var(--muted)" }}
            >
              <Funnel size={12} strokeWidth={ICON_STROKE} aria-hidden="true" />
              Level
            </span>
            {DIFFICULTY_OPTIONS.map((opt) =>
              opt === "all" ? (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDifficulty(opt)}
                  aria-pressed={difficulty === opt}
                  className="rounded-full px-3 py-1 text-xs font-semibold transition-all active:scale-95"
                  style={
                    difficulty === opt
                      ? { backgroundColor: "var(--text)", color: "var(--page)" }
                      : { color: "var(--muted)" }
                  }
                >
                  All levels
                </button>
              ) : (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDifficulty(opt)}
                  aria-pressed={difficulty === opt}
                  aria-label={`Filter by ${opt} difficulty`}
                  className="rounded-full p-0.5 transition-all active:scale-95"
                  style={
                    difficulty === opt
                      ? { outline: "2px solid var(--accent)", outlineOffset: "2px" }
                      : { opacity: 0.75 }
                  }
                >
                  <DifficultyBadge level={opt} />
                </button>
              ),
            )}
            <a
              href="#workflows"
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <WorkflowIcon size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
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
              icon={<Star size={18} strokeWidth={ICON_STROKE} aria-hidden="true" />}
              iconColor="var(--warning)"
              title="Your favorites"
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
            {grouped.map(({ category: cat, commands }) => {
              const Icon = CATEGORY_ICONS[cat.id];
              return (
                <section key={cat.id} aria-label={cat.name} id={`cat-${cat.id}`} className="scroll-mt-40">
                  <SectionHeading
                    icon={<Icon size={18} strokeWidth={ICON_STROKE} aria-hidden="true" />}
                    iconColor={cat.color}
                    title={cat.name}
                    count={commands.length}
                    blurb={cat.description}
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
              );
            })}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="relative overflow-hidden rounded-2xl border border-dashed p-10 text-center sm:p-14"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                color: "var(--muted)",
                backgroundColor: "color-mix(in srgb, var(--muted) 12%, transparent)",
              }}
            >
              <SearchX size={26} strokeWidth={ICON_STROKE} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">No commands found</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
              Nothing matches {debouncedQuery ? `“${debouncedQuery}”` : "these filters"} yet. Try
              “rebase”, “stash”, or “gh pr” — or reset everything below.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setDifficulty("all");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--purple))",
                boxShadow: "0 8px 20px -8px color-mix(in srgb, var(--accent) 70%, transparent)",
              }}
            >
              <RotateCcw size={15} strokeWidth={ICON_STROKE} aria-hidden="true" />
              Reset filters
            </button>
          </div>
        ) : (
          <section aria-label="Filtered commands">
            <SectionHeading
              title={debouncedQuery ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "Commands"}
              blurb={debouncedQuery ? `Matching “${debouncedQuery}”` : "Filtered by your selection."}
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
            icon={<WorkflowIcon size={18} strokeWidth={ICON_STROKE} aria-hidden="true" />}
            iconColor="var(--purple)"
            title="Common workflows"
            blurb="Step-by-step recipes for the situations developers hit every week."
          />
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {WORKFLOWS.map((w) => (
              <WorkflowCard key={w.id} workflow={w} />
            ))}
          </div>
        </section>
      </main>

      <footer className="print-hidden mt-8 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-7 text-xs sm:px-6" style={{ color: "var(--muted)" }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--text)]">GitHub Commands Cheat Sheet</span>
            <span aria-hidden="true">·</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <ExternalLink size={12} strokeWidth={ICON_STROKE} aria-hidden="true" />
              View on GitHub
            </a>
          </div>
          <p className="flex items-center gap-1.5">
            Shortcuts:
            <kbd
              className="rounded-md border px-1.5 py-0.5 font-mono text-[11px]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              /
            </kbd>
            search
            <kbd
              className="rounded-md border px-1.5 py-0.5 font-mono text-[11px]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              Esc
            </kbd>
            clear
          </p>
          <p>Built with Vite, React and Tailwind CSS — static, offline, no tracking.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  title,
  blurb,
  count,
  icon,
  iconColor,
}: {
  title: string;
  blurb?: string;
  count?: number;
  icon?: ReactNode;
  iconColor?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        {icon && iconColor && (
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{
              color: iconColor,
              backgroundColor: `color-mix(in srgb, ${iconColor} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${iconColor} 30%, transparent)`,
            }}
          >
            {icon}
          </span>
        )}
        {title}
        {typeof count === "number" && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: "var(--hover)", color: "var(--muted)" }}
          >
            {count}
          </span>
        )}
      </h2>
      {blurb && <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{blurb}</p>}
    </div>
  );
}
