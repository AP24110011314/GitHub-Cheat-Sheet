import { Search, X } from "lucide-react";
import type { RefObject } from "react";
import { ICON_STROKE } from "./categoryIcons";

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
      <div className="group relative transition-all duration-200 focus-within:-translate-y-px">
        <Search
          size={20}
          strokeWidth={ICON_STROKE}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--accent)]"
        />
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
          className="h-13 w-full rounded-2xl border bg-[var(--page)] py-3.5 pr-28 pl-12 text-[15px] text-[var(--text)] shadow-[0_8px_30px_-12px_rgba(31,35,40,0.4)] outline-none placeholder:text-[var(--muted)] focus:ring-4"
          style={{ borderColor: "var(--border)" }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "";
          }}
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-[var(--hover)]"
              style={{ color: "var(--muted)" }}
            >
              <X size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
              Clear
            </button>
          )}
          <kbd
            aria-hidden="true"
            title="Press / to focus search"
            className="hidden rounded-lg border px-2 py-1 font-mono text-[11px] font-semibold sm:inline"
            style={{ borderColor: "var(--border)", color: "var(--muted)", backgroundColor: "var(--hover)" }}
          >
            /
          </kbd>
        </div>
      </div>
      <p id="search-count" aria-live="polite" className="mt-2 text-center text-xs text-[var(--muted)]">
        Showing <strong className="font-semibold text-[var(--text)]">{resultCount}</strong> of {totalCount}{" "}
        commands
      </p>
    </div>
  );
}
