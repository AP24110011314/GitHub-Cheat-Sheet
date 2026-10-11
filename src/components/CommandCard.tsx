import { Check, Copy, Star, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category, GitCommand } from "../data/commands";
import { CATEGORY_ICONS, CATEGORY_PALETTE, ICON_STROKE } from "./categoryIcons";
import { DifficultyBadge } from "./DifficultyBadge";
import { Highlight } from "./Highlight";

interface CommandCardProps {
  cmd: GitCommand;
  category: Category;
  query: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  /** Called after a successful copy — App shows a bottom toast on touch devices. */
  onCopied?: (message: string) => void;
}

function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers (http, in-app webviews).
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

interface Token {
  text: string;
  start: number;
}

/** Split a command into tokens (keeping quoted strings whole) with offsets. */
function tokenize(command: string): Token[] {
  const tokens: Token[] = [];
  const re = /"[^"]*"|'[^']*'|\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(command)) !== null) {
    tokens.push({ text: m[0], start: m.index });
  }
  return tokens;
}

/**
 * Token colouring for dark-mode Forest Sage:
 *  index=0 → amber (#DB9558) — the command binary (git / gh)
 *  starts with "-" → muted cream (flags/options)
 *  quoted string → light sage (#A8BBA3)
 *  operators → muted cream
 *  all else → cream text (subcommands etc.)
 */
function tokenClass(token: string, index: number): string {
  if (index === 0) return "font-semibold text-[var(--code-cmd)]";
  if (token === "&&" || token === "|" || token === ";")
    return "opacity-50 text-[var(--code-flag)]";
  if (token.startsWith("-")) return "text-[var(--code-flag)] font-medium";
  if (token.startsWith('"') || token.startsWith("'"))
    return "text-[var(--code-str)]";
  return "text-[var(--code-text)]";
}

function TokenizedCommand({
  command,
  query,
}: {
  command: string;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const matchStart = q ? command.toLowerCase().indexOf(q) : -1;
  const matchEnd = matchStart === -1 ? -1 : matchStart + q.length;

  return (
    <>
      {tokenize(command).map((t, i) => {
        const cls = tokenClass(t.text, i);
        const key = `${i}-${t.start}`;
        if (
          matchStart === -1 ||
          t.start + t.text.length <= matchStart ||
          t.start >= matchEnd
        ) {
          return (
            <span key={key} className={cls}>
              {i > 0 ? " " : ""}
              {t.text}
            </span>
          );
        }
        const relStart = Math.max(0, matchStart - t.start);
        const relEnd = Math.min(t.text.length, matchEnd - t.start);
        return (
          <span key={key} className={cls}>
            {i > 0 ? " " : ""}
            {t.text.slice(0, relStart)}
            <mark className="search-match">{t.text.slice(relStart, relEnd)}</mark>
            {t.text.slice(relEnd)}
          </span>
        );
      })}
    </>
  );
}

export function CommandCard({
  cmd,
  category,
  query,
  isFavorite,
  onToggleFavorite,
  onCopied,
}: CommandCardProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = async () => {
    const ok = await copyText(cmd.command);
    if (ok) {
      setCopied(true);
      onCopied?.(`Copied: ${cmd.command}`);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const CategoryIcon = CATEGORY_ICONS[category.id];
  const catPalette = CATEGORY_PALETTE[category.id];

  /**
   * Destructive cards: amber-brown left border + faint tint.
   * This replaces the old red-based approach — no reds anywhere in dark mode.
   */
  const isDestructive = Boolean(cmd.careful);

  // Hover glow only where hover exists — touch taps skip straight to :active.
  const applyHover = (el: HTMLElement) => {
    if (!canHover()) return;
    el.style.boxShadow =
      "0 8px 24px -8px var(--shadow-hover-amber), 0 2px 8px -2px var(--shadow-color)";
    el.style.borderColor = isDestructive
      ? "var(--destructive)"
      : "color-mix(in srgb, var(--accent) 50%, var(--border))";
  };
  const clearHover = (el: HTMLElement) => {
    if (!canHover()) return;
    el.style.boxShadow = "0 2px 8px -2px var(--shadow-color)";
    el.style.borderColor = isDestructive
      ? "var(--destructive-border)"
      : "var(--border)";
  };

  return (
    <article
      aria-label={cmd.command}
      className="card-enter lift print-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-[var(--card)]"
      style={{
        borderColor: isDestructive
          ? "var(--destructive-border)"
          : "var(--border)",
        boxShadow: "0 2px 8px -2px var(--shadow-color)",
        /* Destructive cards get a left-side amber-brown accent line */
        borderLeftWidth: isDestructive ? "3px" : "1px",
        borderLeftColor: isDestructive ? "var(--destructive)" : "var(--border)",
      }}
      onMouseEnter={(e) => applyHover(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => clearHover(e.currentTarget as HTMLElement)}
    >
      {/* Top accent bar: sage → amber gradient */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, var(--secondary), var(--accent) 80%, transparent)`,
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        {/* Category label + difficulty badge — wraps instead of squeezing */}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
              style={{
                /* Icon chip: sage-to-amber low-opacity gradient background, sage icon */
                color: catPalette.dark,
                backgroundColor: `color-mix(in srgb, ${catPalette.dark} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${catPalette.dark} 30%, var(--border))`,
              }}
            >
              <CategoryIcon size={13} strokeWidth={ICON_STROKE} />
            </span>
            <span className="truncate text-[var(--muted)]">{category.name}</span>
          </span>
          <DifficultyBadge level={cmd.difficulty} />
        </div>

        {/* Code block — scrolls internally, never breaks the card */}
        <div
          className="min-w-0 overflow-hidden rounded-xl border transition-colors"
          style={{
            backgroundColor: "var(--code-bg)",
            borderColor: "var(--code-border)",
          }}
        >
          {/* Terminal chrome: 3 dots (cream / amber / sage) */}
          <div
            className="flex items-center gap-1.5 border-b px-3 py-1.5"
            style={{ borderColor: "var(--code-border)" }}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--text)" }}  /* cream */
            />
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }} /* amber */
            />
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--secondary)" }} /* sage */
            />
            <span
              aria-hidden="true"
              className="ml-1 font-mono text-[10px] tracking-wider text-[var(--muted)]"
            >
              bash
            </span>

            {/* Copy button: 44px target, amber outline → solid amber on hover → sage on success */}
            <button
              type="button"
              onClick={handleCopy}
              aria-label={
                copied ? `Copied ${cmd.command}` : `Copy ${cmd.command}`
              }
              aria-live="polite"
              className="print-hidden ml-auto inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1 rounded-md border px-3 font-mono text-[11px] font-semibold transition-all duration-150 active:scale-95"
              style={
                copied
                  ? {
                      /* Success state: sage */
                      color: "var(--badge-beginner)",
                      borderColor: "var(--badge-beginner-border)",
                      backgroundColor: "var(--badge-beginner-bg)",
                    }
                  : {
                      /* Default: amber outline */
                      color: "var(--accent)",
                      borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                      backgroundColor: "transparent",
                    }
              }
            >
              {copied ? (
                <Check size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
              ) : (
                <Copy size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Command line — internal horizontal scroll, thin scrollbar */}
          <code className="term-scroll block overflow-x-auto px-3.5 py-3 font-mono text-[13px] leading-relaxed whitespace-pre">
            {/* $ prompt in sage */}
            <span
              aria-hidden="true"
              className="mr-2 font-bold select-none"
              style={{ color: "var(--code-prompt)" }}
            >
              $
            </span>
            <TokenizedCommand command={cmd.command} query={query} />
          </code>
        </div>

        {/* Description — 14px minimum body text */}
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          <Highlight text={cmd.description} query={query} />
        </p>

        {/* Example — wraps long URLs instead of overflowing */}
        <p
          className="min-w-0 rounded-lg border px-3 py-1.5 text-xs"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "color-mix(in srgb, var(--raised) 60%, transparent)",
          }}
        >
          <span className="font-semibold text-[var(--text)]">Example · </span>
          <code className="font-mono text-[12px] break-words text-[var(--muted)]">
            <Highlight text={cmd.example} query={query} />
          </code>
        </p>

        {/* Destructive warning — amber-brown, no red */}
        {cmd.careful && (
          <p
            role="note"
            className="flex min-w-0 gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed"
            style={{
              color: "var(--destructive)",
              borderColor: "var(--destructive-border)",
              backgroundColor: "var(--destructive-bg)",
            }}
          >
            <TriangleAlert
              size={14}
              strokeWidth={ICON_STROKE}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            <span className="min-w-0">
              <strong>Careful — </strong>
              {cmd.careful}
            </span>
          </p>
        )}

        {/* Favorite star — 44px target */}
        <div className="print-hidden mt-auto flex items-center pt-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(cmd.id)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remove ${cmd.command} from favorites`
                : `Add ${cmd.command} to favorites`
            }
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3.5 text-xs font-semibold transition-all duration-150 active:scale-95"
            style={
              isFavorite
                ? {
                    /* Filled amber + soft amber glow */
                    color: "var(--accent)",
                    borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                    backgroundColor: "var(--badge-intermediate-bg)",
                    boxShadow:
                      "0 0 8px color-mix(in srgb, var(--accent) 20%, transparent)",
                  }
                : {
                    /* Outline muted cream */
                    color: "var(--muted)",
                    borderColor: "var(--border)",
                  }
            }
          >
            <span
              key={isFavorite ? "on" : "off"}
              className={isFavorite ? "star-pop inline-flex" : "inline-flex"}
            >
              <Star
                size={14}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </span>
            {isFavorite ? "Starred" : "Star"}
          </button>
        </div>
      </div>
    </article>
  );
}
