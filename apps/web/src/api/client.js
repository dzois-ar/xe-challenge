/**
 * Minimal fetch wrapper:
 * - handles JSON
 * 
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // backend errors are JSON: { message, details }
    const err = new Error(body?.message || "Request failed");
    err.status = res.status;
    err.details = body?.details;
    throw err;
  }

  return body;
}
