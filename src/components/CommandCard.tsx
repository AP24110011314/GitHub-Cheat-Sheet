import { useEffect, useRef, useState } from "react";
import type { Category, GitCommand } from "../data/commands";
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

  return (
    <article
      aria-label={cmd.command}
      className="card-enter print-card group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-slate-900/80 dark:backdrop-blur dark:hover:border-white/20 dark:hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]"
    >
      <div
        aria-hidden="true"
        className="h-1 w-full opacity-80"
        style={{ background: `linear-gradient(90deg, ${category.color}, transparent 130%)` }}
      />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color, boxShadow: `0 0 0 4px ${category.color}22` }}
            />
            {category.name}
          </span>
          <DifficultyBadge level={cmd.difficulty} />
        </div>

        <div className="overflow-hidden rounded-xl bg-[#0d1117] ring-1 ring-black/20 dark:ring-white/10">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span aria-hidden="true" className="ml-1 font-mono text-[10px] tracking-wide text-slate-500">
              bash
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? `Copied ${cmd.command}` : `Copy ${cmd.command}`}
              className={`print-hidden ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
                copied
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 1.042-1.08l2.72 2.72 6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="term-scroll block overflow-x-auto px-3 py-2.5 font-mono text-[13px] leading-relaxed whitespace-pre text-slate-100">
            <span aria-hidden="true" className="mr-1.5 text-emerald-400 select-none">$</span>
            <Highlight text={cmd.command} query={query} />
          </code>
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <Highlight text={cmd.description} query={query} />
        </p>

        <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Example · </span>
          <code className="font-mono text-[12px] break-all">
            <Highlight text={cmd.example} query={query} />
          </code>
        </p>

        {cmd.careful && (
          <p
            role="note"
            className="flex gap-1.5 rounded-lg border border-red-200/80 bg-gradient-to-r from-red-50 to-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-red-800 dark:border-red-500/20 dark:from-red-950/50 dark:to-amber-950/30 dark:text-red-300"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="currentColor">
              <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM8.75 5.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </svg>
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
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              isFavorite
                ? "border-amber-300 bg-amber-50 text-amber-700 shadow-[0_0_12px_-4px_rgba(245,158,11,0.6)] dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-amber-500/40 dark:hover:text-amber-300"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {isFavorite ? "Starred" : "Star"}
          </button>
        </div>
      </div>
    </article>
  );
}
