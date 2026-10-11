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
      className="print-card flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          {category.name}
        </span>
        <DifficultyBadge level={cmd.difficulty} />
      </div>

      <code className="block overflow-x-auto rounded-md bg-slate-950 px-3 py-2 font-mono text-[13px] leading-relaxed text-green-300 dark:bg-black">
        <Highlight text={cmd.command} query={query} />
      </code>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        <Highlight text={cmd.description} query={query} />
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">Example: </span>
        <code className="font-mono text-[12px]">
          <Highlight text={cmd.example} query={query} />
        </code>
      </p>

      {cmd.careful && (
        <p
          role="note"
          className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
        >
          <span aria-hidden="true">⚠ careful — </span>
          {cmd.careful}
        </p>
      )}

      <div className="print-hidden mt-auto flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `Copied ${cmd.command}` : `Copy ${cmd.command}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(cmd.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${cmd.command} from favorites` : `Add ${cmd.command} to favorites`}
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
            isFavorite
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
          {isFavorite ? "Starred" : "Star"}
        </button>
      </div>
    </article>
  );
}
