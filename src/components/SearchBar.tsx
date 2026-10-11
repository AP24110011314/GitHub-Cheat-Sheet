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
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
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
          placeholder="Search commands, descriptions, keywords…"
          aria-describedby="search-count"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-20 pl-9 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              ✕
            </button>
          )}
          <kbd
            aria-hidden="true"
            className="hidden rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] text-slate-500 sm:inline dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            /
          </kbd>
        </div>
      </div>
      <p id="search-count" aria-live="polite" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        Showing {resultCount} of {totalCount} commands
      </p>
    </div>
  );
}
