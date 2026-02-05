import { useEffect, useState } from "react";

/**
 * Debounces a value after `delayMs`.
 * Prevents spamming API calls while user types.
 */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}
