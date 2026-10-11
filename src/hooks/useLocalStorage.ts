import { useState } from "react";

/** Persisted state backed by localStorage. JSON-serializes values. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      // Corrupt or unavailable storage — fall back to default.
    }
    return initialValue;
  });

  const set = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage full or blocked (private mode) — keep in-memory value.
      }
      return resolved;
    });
  };

  return [value, set] as const;
}
