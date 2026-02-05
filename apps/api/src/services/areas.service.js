/**
 * Talks to upstream autocomplete API and returns normalized results.
 * Adds TTL caching to reduce API calls.
 */
const axios = require("axios");
const { getCache, setCache } = require("../libs/cache");
const { ApiError } = require("../libs/errors");

const UPSTREAM =
  "https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/";

const axiosClient = axios.create({
  timeout: Number(process.env.HTTP_TIMEOUT_MS || 10000),
  headers: { Accept: "application/json" }
});

const TTL_MS = Number(process.env.AREAS_CACHE_TTL_MS || 10 * 60 * 1000);

async function autocomplete(input) {
  const key = input.trim().toLowerCase();

  const cached = getCache(key);
  if (cached) return cached;

  try {
    const resp = await axiosClient.get(UPSTREAM, { params: { input: key } });

    // Normalize output so frontend gets consistent shape.
    const items = Array.isArray(resp.data)
      ? resp.data.map((x) => ({
          placeId: x.placeId,
          mainText: x.mainText,
          secondaryText: x.secondaryText
        }))
      : [];

    setCache(key, items, TTL_MS);
    return items;
  } catch {
    throw new ApiError(502, "Failed to fetch area suggestions");
  }
}

module.exports = { autocomplete };
