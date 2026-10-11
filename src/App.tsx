import {
  ExternalLink,
  Funnel,
  Printer,
  RotateCcw,
  SearchX,
  Star,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BackToTop } from "./components/BackToTop";
import { CategoryNav, type CategoryFilter } from "./components/CategoryNav";
import {
  CATEGORY_ICONS,
  CATEGORY_PALETTE,
  ICON_STROKE,
} from "./components/categoryIcons";
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

const DIFFICULTY_OPTIONS: DifficultyFilter[] = [
  "all",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const REPO_URL = "https://github.com/AP24110011314/GitHub-Cheat-Sheet";

function matchesQuery(haystack: string, q: string): boolean {
  return haystack.toLowerCase().includes(q);
}

/** Small bottom toast confirming "Copied!" taps — clears the home indicator. */
function CopyToast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={message === null}
      className={`print-hidden fixed bottom-4 left-1/2 z-40 max-w-[calc(100vw-2rem)] rounded-full border px-4 py-3 font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
        message ? "mobile-toast opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
        backgroundColor: "var(--card)",
        borderColor: "var(--badge-beginner-border)",
        color: "var(--badge-beginner)",
        boxShadow: "0 8px 24px -8px var(--shadow-hover)",
        transform: message ? "translate(-50%, 0)" : "translate(-50%, 12px)",
        pointerEvents: message ? "auto" : "none",
      }}
    >
      <span className="block max-w-[70vw] truncate">{message ?? ""}</span>
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(
    "gh-cheatsheet-favorites",
    [],
  );
  const searchRef = useRef<HTMLInputElement | null>(null);
  const debouncedQuery = useDebounce(query, 150).trim().toLowerCase();

  // Bottom "Copied" toast — shared by every card.
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);
  const notifyCopied = (message: string) => {
    const short =
      message.length > 48 ? `${message.slice(0, 48)}…` : message;
    setToast(short);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  };

  const categoriesById = useMemo(
    () => new Map(CATEGORIES.map((c) => [c.id, c])),
    [],
  );
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  // Keyboard shortcuts: `/` focuses search, `Esc` clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target !== null &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
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
      if (
        category !== "all" &&
        category !== "favorites" &&
        cmd.category !== category
      )
        return false;
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
  }, [category, difficulty, debouncedQuery]);

  const showFavoritesView =
    category === "favorites" && !debouncedQuery && difficulty === "all";

  return (
    <div className="min-h-dvh overflow-x-clip bg-[var(--page)] text-[var(--text)] transition-colors">
      <a
        href="#commands"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to commands
      </a>

      {/* ── Hero Header ─────────────────────────────────── */}
      <header
        className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--card)] text-[var(--text)] transition-colors print:bg-white print:text-black"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          aria-hidden="true"
          className="print-hidden pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Amber radial glow — top-left, ~8-10% opacity (hidden on phones) */}
          <div
            className="hero-orb absolute -top-40 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)",
            }}
          />
          {/* Sage radial glow — bottom-right, ~8% opacity (hidden on phones) */}
          <div
            className="hero-orb absolute -right-16 -bottom-20 h-80 w-80 rounded-full blur-3xl"
            style={{
              animationDelay: "-7s",
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)",
            }}
          />
          {/* Subtle dot-grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] opacity-[0.028] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
        </div>

        {/* 16px mobile → 24px tablet → 32px desktop, capped so lines stay short */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:px-8 2xl:max-w-7xl">
          <div className="hero-enter flex items-center justify-between gap-2 sm:gap-3">
            <p className="inline-flex min-h-[44px] min-w-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--page)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)] shadow-xs">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--secondary)]"
              />
              <span className="truncate">git help --daily-reference</span>
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print or download as PDF"
                className="print-hidden hidden min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] shadow-xs transition-all active:scale-95 sm:inline-flex"
              >
                <Printer size={15} strokeWidth={ICON_STROKE} aria-hidden="true" />
                Print / PDF
              </button>
            </div>
          </div>

          <div
            className="hero-enter mx-auto mt-6 flex w-full max-w-2xl flex-col items-center text-center sm:mt-8"
            style={{ animationDelay: "80ms" }}
          >
            {/* Fluid clamp() title — never overflows at 320px */}
            <h1 className="fluid-hero-title font-extrabold tracking-tight">
              {/* Line 1: cream */}
              <span className="text-[var(--text)]">GitHub Commands</span>
              {" "}
              {/* Line 2: amber → lighter amber → sage gradient */}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--accent), var(--accent-hover) 55%, var(--secondary))",
                }}
              >
                Cheat Sheet
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Every Git &amp;{" "}
              <span className="font-mono text-[13px] font-semibold text-[var(--text)]">
                gh
              </span>{" "}
              command worth memorizing — searchable in milliseconds, available fully
              offline.
            </p>
          </div>

          <div
            className="hero-enter mx-auto mt-6 w-full max-w-2xl"
            style={{ animationDelay: "160ms" }}
          >
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

          {/* Stat pills: 2×2 grid on phones, wrapping row on tablet+ */}
          <dl
            className="hero-enter mx-auto mt-5 grid w-full max-w-md grid-cols-2 gap-2 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-2.5"
            style={{ animationDelay: "220ms" }}
            aria-label="Cheat sheet statistics"
          >
            {([
              [`${COMMANDS.length}`, "commands", "amber"],
              [`${CATEGORIES.length}`, "categories", "sage"],
              [`${WORKFLOWS.length}`, "workflows", "amber"],
              ["100%", "offline", "sage"],
            ] as [string, string, "amber" | "sage"][]).map(([num, label, accent]) => (
              <div
                key={label}
                className="flex items-baseline justify-center gap-1.5 rounded-xl border bg-[var(--card)] px-3.5 py-2 sm:py-1.5"
                style={{
                  borderColor: "var(--border)",
                  boxShadow: "0 1px 4px -1px var(--shadow-color)",
                }}
              >
                <dt className="sr-only">{label}</dt>
                {/* Alternate amber / sage for the bold number */}
                <dd
                  aria-hidden="true"
                  className="font-mono text-base font-bold"
                  style={{
                    color:
                      accent === "amber"
                        ? "var(--accent)"
                        : "var(--secondary)",
                  }}
                >
                  {num}
                </dd>
                <dd aria-hidden="true" className="text-xs text-[var(--muted)]">
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

      {/* ── Sticky Toolbar ───────────────────────────────── */}
      <div
        className="sticky-bar print-hidden sticky top-0 z-20 border-b transition-colors"
        style={{
          borderColor: "var(--border)",
          backgroundColor:
            "color-mix(in srgb, var(--page) 88%, transparent)",
        }}
      >
        <div className="sticky-safe mx-auto flex w-full max-w-6xl flex-col gap-2 py-2 sm:gap-2.5 sm:py-3 2xl:max-w-7xl">
          <CategoryNav
            selected={category}
            onSelect={setCategory}
            counts={counts}
            favoritesCount={favoriteIds.length}
            totalCount={COMMANDS.length}
          />
          {/* Level filter: horizontal scroll rail on phones, wrap on tablet+ */}
          <div
            className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            role="group"
            aria-label="Filter by difficulty"
          >
            <span
              className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-[var(--muted)]"
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
                  className="min-h-[44px] shrink-0 rounded-full px-4 text-xs font-semibold transition-all active:scale-95"
                  style={
                    difficulty === opt
                      ? {
                          /* Active: amber fill, dark forest text for contrast */
                          backgroundColor: "var(--accent)",
                          color: "var(--page)",
                        }
                      : {
                          color: "var(--muted)",
                          backgroundColor: "transparent",
                        }
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
                  className="shrink-0 rounded-full p-1 transition-all active:scale-95"
                  style={{
                    minHeight: "44px",
                    minWidth: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(difficulty === opt
                      ? {
                          outline: "2px solid var(--accent)",
                          outlineOffset: "2px",
                        }
                      : { opacity: 0.75 }),
                  }}
                >
                  <DifficultyBadge level={opt} />
                </button>
              ),
            )}
            <a
              href="#workflows"
              className="ml-auto inline-flex min-h-[44px] shrink-0 items-center gap-1 px-2 text-xs font-semibold"
              style={{ color: "var(--accent-text)" }}
            >
              <WorkflowIcon
                size={13}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
              Common workflows
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <main
        id="commands"
        className="mx-auto w-full max-w-6xl scroll-mt-44 px-4 py-6 sm:scroll-mt-40 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-7xl"
      >
        {showFavoritesView ? (
          <section aria-label="Favorite commands" className="cv-section">
            <SectionHeading
              icon={
                <Star
                  size={18}
                  strokeWidth={ICON_STROKE}
                  aria-hidden="true"
                  fill="currentColor"
                />
              }
              iconColor="var(--accent)"
              title="Your favorites"
              blurb="Your starred commands, saved locally in this browser."
            />
            <FavoritesView
              favorites={favoriteCommands}
              categoriesById={categoriesById}
              query={debouncedQuery}
              onToggleFavorite={toggleFavorite}
              onBrowseAll={() => setCategory("all")}
              onCopied={notifyCopied}
            />
          </section>
        ) : grouped ? (
          <div className="flex flex-col gap-10 sm:gap-12">
            {grouped.map(({ category: cat, commands }) => {
              const Icon = CATEGORY_ICONS[cat.id];
              const catPalette = CATEGORY_PALETTE[cat.id];
              return (
                <section
                  key={cat.id}
                  aria-label={cat.name}
                  id={`cat-${cat.id}`}
                  className="cv-section scroll-mt-44 sm:scroll-mt-40"
                >
                  <SectionHeading
                    icon={<Icon size={18} strokeWidth={ICON_STROKE} aria-hidden="true" />}
                    /* Pass the dark palette color; SectionHeading uses it for the icon chip */
                    iconColor={catPalette.dark}
                    title={cat.name}
                    count={commands.length}
                    blurb={cat.description}
                  />
                  {/* 1 col phones → 2 tablet → 3 desktop → 4 very wide */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {commands.map((cmd) => (
                      <CommandCard
                        key={cmd.id}
                        cmd={cmd}
                        category={cat}
                        query=""
                        isFavorite={favoriteSet.has(cmd.id)}
                        onToggleFavorite={toggleFavorite}
                        onCopied={notifyCopied}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="relative overflow-hidden rounded-2xl border border-dashed p-6 text-center sm:p-10 lg:p-14"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              boxShadow: "0 2px 8px -2px var(--shadow-color)",
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                color: "var(--muted)",
                backgroundColor: "var(--hover)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <SearchX size={26} strokeWidth={ICON_STROKE} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-[var(--text)]">
              No commands found
            </h2>
            <p
              className="mx-auto mt-1 max-w-sm text-sm"
              style={{ color: "var(--muted)" }}
            >
              Nothing matches{" "}
              {debouncedQuery ? `“${debouncedQuery}”` : "these filters"} yet. Try
              “rebase”, “stash”, or “gh pr” — or reset filters below.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setDifficulty("all");
              }}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                /* Dark forest text on amber for maximum contrast */
                color: "var(--page)",
                boxShadow:
                  "0 4px 14px -2px color-mix(in srgb, var(--accent) 45%, transparent)",
              }}
            >
              <RotateCcw size={15} strokeWidth={ICON_STROKE} aria-hidden="true" />
              Reset filters
            </button>
          </div>
        ) : (
          <section aria-label="Filtered commands" className="cv-section">
            <SectionHeading
              title={
                debouncedQuery
                  ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
                  : "Commands"
              }
              blurb={
                debouncedQuery
                  ? `Matching “${debouncedQuery}”`
                  : "Filtered by your selection."
              }
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                    onCopied={notifyCopied}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ── Workflows Section ───────────────────────────── */}
        <section
          id="workflows"
          aria-label="Common workflows"
          className="cv-section mt-12 scroll-mt-44 sm:mt-16 sm:scroll-mt-40"
        >
          <SectionHeading
            icon={
              <WorkflowIcon
                size={18}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
            }
            /* Workflows: sage icon (informational section) */
            iconColor="var(--secondary)"
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

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        className="print-hidden mt-12 border-t"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-6 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-8 lg:px-8 2xl:max-w-7xl"
          style={{ color: "var(--muted)" }}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--text)]">
              GitHub Commands Cheat Sheet
            </span>
            <span aria-hidden="true">·</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 font-semibold"
              style={{ color: "var(--accent-text)" }}
            >
              <ExternalLink
                size={12}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
              View on GitHub
            </a>
          </div>
          {/* Keyboard-shortcut legend is meaningless on touch — hide on coarse pointers */}
          <p className="kbd-hint hidden items-center gap-1.5 sm:flex">
            Shortcuts:
            <kbd
              className="rounded-md border px-1.5 py-0.5 font-mono text-[11px]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--page)",
                color: "var(--text)",
              }}
            >
              /
            </kbd>
            search
            <kbd
              className="rounded-md border px-1.5 py-0.5 font-mono text-[11px]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--page)",
                color: "var(--text)",
              }}
            >
              Esc
            </kbd>
            clear
          </p>
          <p>
            Built with Vite, React and Tailwind CSS — static, offline, no
            tracking.
          </p>
        </div>
      </footer>

      <BackToTop />
      <CopyToast message={toast} />
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
      <h2 className="fluid-section-title flex min-w-0 flex-wrap items-center gap-2.5 font-bold tracking-tight text-[var(--text)]">
        {icon && iconColor && (
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
            style={{
              color: iconColor,
              backgroundColor: `color-mix(in srgb, ${iconColor} 14%, transparent)`,
              border: `1px solid color-mix(in srgb, ${iconColor} 30%, transparent)`,
            }}
          >
            {icon}
          </span>
        )}
        <span className="min-w-0 break-words">{title}</span>
        {typeof count === "number" && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{
              /* Count badge: sage pill — informational / supporting role */
              backgroundColor:
                "color-mix(in srgb, var(--secondary) 14%, transparent)",
              color: "var(--secondary)",
              border:
                "1px solid color-mix(in srgb, var(--secondary) 30%, transparent)",
            }}
          >
            {count}
          </span>
        )}
      </h2>
      {blurb && (
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          {blurb}
        </p>
      )}
    </div>
  );
}
