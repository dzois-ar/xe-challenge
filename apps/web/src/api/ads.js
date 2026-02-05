import { apiFetch } from "./client";

// Send POST request to create a new ad
export function createAd(payload) {
  return apiFetch("/api/ads", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

 // Fetch a single ad by its id
export function getAd(id) {
  return apiFetch(`/api/ads/${id}`);
}
