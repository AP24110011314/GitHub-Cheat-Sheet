import { Check, Copy, Star, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category, GitCommand } from "../data/commands";
import { CATEGORY_ICONS, ICON_STROKE } from "./categoryIcons";
import { DifficultyBadge } from "./DifficultyBadge";
import { Highlight } from "./Highlight";

interface CommandCardProps {
  cmd: GitCommand;
  category: Category;
  query: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
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

function tokenClass(token: string, index: number): string {
  if (index === 0) return "font-semibold text-[var(--accent)]";
  if (token === "&&" || token === "|" || token === ";") return "text-[var(--muted)]";
  if (token.startsWith("-")) return "text-[var(--purple)]";
  if (token.startsWith('"') || token.startsWith("'")) return "text-[var(--success)]";
  return "text-[#e6edf3]";
}

/**
 * Render a command with syntax-like tinting (binary in accent, flags in
 * purple, strings in green) while preserving whole-query match highlighting.
 */
function TokenizedCommand({ command, query }: { command: string; query: string }) {
  const q = query.trim().toLowerCase();
  const matchStart = q ? command.toLowerCase().indexOf(q) : -1;
  const matchEnd = matchStart === -1 ? -1 : matchStart + q.length;

  return (
    <>
      {tokenize(command).map((t, i) => {
        const cls = tokenClass(t.text, i);
        const key = `${i}-${t.start}`;
        if (matchStart === -1 || t.start + t.text.length <= matchStart || t.start >= matchEnd) {
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

export function CommandCard({ cmd, category, query, isFavorite, onToggleFavorite }: CommandCardProps) {
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
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const CategoryIcon = CATEGORY_ICONS[category.id];

  return (
    <article
      aria-label={cmd.command}
      className="card-enter print-card group flex flex-col overflow-hidden rounded-2xl border bg-[var(--card)] shadow-[0_1px_2px_rgba(31,35,40,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(31,35,40,0.3)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${category.color}, transparent 140%)` }}
      />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md"
              style={{
                color: category.color,
                backgroundColor: `color-mix(in srgb, ${category.color} 14%, transparent)`,
              }}
            >
              <CategoryIcon size={13} strokeWidth={ICON_STROKE} />
            </span>
            <span className="text-[var(--muted)]">{category.name}</span>
          </span>
          <DifficultyBadge level={cmd.difficulty} />
        </div>

        <div
          className="overflow-hidden rounded-xl border"
          style={{ backgroundColor: "var(--code-bg)", borderColor: "var(--code-border)" }}
        >
          <div className="flex items-center gap-1.5 border-b px-3 py-1.5" style={{ borderColor: "var(--code-border)" }}>
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span aria-hidden="true" className="ml-1 font-mono text-[10px] tracking-wide text-[#8b949e]">
              bash
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? `Copied ${cmd.command}` : `Copy ${cmd.command}`}
              className={`print-hidden ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] transition-all active:scale-90 ${
                copied ? "bg-[#3fb950]/20 text-[#3fb950]" : "text-[#8b949e] hover:bg-white/10 hover:text-white"
              }`}
            >
              {copied ? <Check size={13} strokeWidth={ICON_STROKE} aria-hidden="true" /> : <Copy size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="term-scroll block overflow-x-auto px-3 py-2.5 font-mono text-[13px] leading-relaxed whitespace-pre">
            <span aria-hidden="true" className="mr-1.5 text-[#3fb950] select-none">
              $
            </span>
            <TokenizedCommand command={cmd.command} query={query} />
          </code>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">
          <Highlight text={cmd.description} query={query} />
        </p>

        <p
          className="rounded-lg border px-2.5 py-1.5 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--page)" }}
        >
          <span className="font-semibold">Example · </span>
          <code className="font-mono text-[12px] break-all text-[var(--muted)]">
            <Highlight text={cmd.example} query={query} />
          </code>
        </p>

        {cmd.careful && (
          <p
            role="note"
            className="flex gap-2 rounded-lg border px-2.5 py-2 text-xs leading-relaxed"
            style={{
              color: "var(--danger)",
              borderColor: "color-mix(in srgb, var(--danger) 40%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--danger) 8%, transparent)",
            }}
          >
            <TriangleAlert size={14} strokeWidth={ICON_STROKE} aria-hidden="true" className="mt-px shrink-0" />
            <span>
              <strong>Careful — </strong>
              {cmd.careful}
            </span>
          </p>
        )}

        <div className="print-hidden mt-auto flex items-center pt-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(cmd.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${cmd.command} from favorites` : `Add ${cmd.command} to favorites`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95"
            style={
              isFavorite
                ? {
                    color: "var(--warning)",
                    borderColor: "color-mix(in srgb, var(--warning) 45%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--warning) 12%, transparent)",
                  }
                : { color: "var(--muted)", borderColor: "var(--border)" }
            }
          >
            <span key={isFavorite ? "on" : "off"} className={isFavorite ? "star-pop inline-flex" : "inline-flex"}>
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

