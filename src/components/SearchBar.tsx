import type { RefObject } from "react";

interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, onClear, inputRef, resultCount, totalCount }: SearchBarProps) {
  return (
    <div role="search" className="w-full">
      <label htmlFor="command-search" className="sr-only">
        Search commands
      </label>
      <div className="group relative transition-all duration-200 focus-within:-translate-y-px focus-within:drop-shadow-[0_8px_24px_rgba(99,102,241,0.25)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
        >
          <path
            d="M9 2a7 7 0 1 0 4.9 12L18 18l1-1-4.1-4.1A7 7 0 0 0 9 2Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
            fill="currentColor"
          />
        </svg>
        <input
          ref={inputRef}
          id="command-search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search 144 commands… try “rebase”, “stash”, “gh pr”"
          aria-describedby="search-count"
          className="h-13 w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-24 pl-11 text-[15px] text-slate-900 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.15)] outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 dark:hover:text-white"
            >
              Clear ✕
            </button>
          )}
          <kbd
            aria-hidden="true"
            className="hidden rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] font-semibold text-slate-500 sm:inline dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
          >
            /
          </kbd>
        </div>
      </div>
      <p id="search-count" aria-live="polite" className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Showing <strong className="font-semibold text-slate-700 dark:text-slate-200">{resultCount}</strong> of{" "}
        {totalCount} commands
      </p>
    </div>
  );
}
