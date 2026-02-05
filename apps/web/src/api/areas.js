import { apiFetch } from "./client";

/**
 * Calls backend : GET /api/areas?input=...
 */
export function fetchAreas(input, signal) {
  const q = new URLSearchParams({ input }).toString();
  return apiFetch(`/api/areas?${q}`, { signal });
}
