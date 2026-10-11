import { useEffect, useState } from "react";

/** Return `value` delayed by `delay`ms — keeps fast typing smooth. */
export function useDebounce<T>(value: T, delayMs = 150): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
