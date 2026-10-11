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

export function SearchBar({
  value,
  onChange,
  onClear,
  inputRef,
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div role="search" className="print-hidden w-full">
      <label htmlFor="command-search" className="sr-only">
        Search commands
      </label>
      <div className="group relative transition-all duration-200">
        <Search
          size={18}
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
          enterKeyHint="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search commands… try “rebase”"
          aria-describedby="search-count"
          // 16px font prevents iOS auto-zoom on focus; 52px+ height = comfy touch target.
          className="h-[52px] w-full rounded-2xl border py-3.5 pr-24 pl-11 text-base outline-none transition-all placeholder:text-[var(--muted)] sm:pr-28 sm:text-[15px]"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text)",
            boxShadow: "0 4px 16px -4px var(--shadow-color)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px color-mix(in srgb, var(--accent) 24%, transparent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow =
              "0 4px 16px -4px var(--shadow-color)";
          }}
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg px-3 text-xs font-medium transition-colors active:scale-95"
              style={{ color: "var(--muted)" }}
            >
              <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
              Clear
            </button>
          )}
          {/* Hidden on touch devices via .kbd-hint CSS (hover:none / pointer:coarse),
              and below sm regardless — it only makes sense with a physical keyboard. */}
          <kbd
            aria-hidden="true"
            title="Press / to focus search"
            className="kbd-hint hidden rounded-lg border px-2 py-1 font-mono text-[11px] font-semibold sm:inline"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
              backgroundColor: "var(--hover)",
            }}
          >
            /
          </kbd>
        </div>
      </div>
      <p
        id="search-count"
        aria-live="polite"
        className="mt-2 text-center text-xs text-[var(--muted)]"
      >
        Showing{" "}
        <strong className="font-semibold text-[var(--text)]">{resultCount}</strong> of{" "}
        {totalCount} commands
      </p>
    </div>
  );
}
