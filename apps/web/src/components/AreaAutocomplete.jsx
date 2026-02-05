import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAreas } from "../api/areas";
import { useDebounce } from "../hooks/useDebounce";

/**
 * Props:
 * - value: current text in input
 * - selectedPlaceId: string (optional but recommended)
 * - onChange(text)
 * - onSelect({ placeId, label })
 * - error (string)
 */
export function AreaAutocomplete({ value, selectedPlaceId, onChange, onSelect, error }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);

  const debounced = useDebounce(value, 300);
  const abortRef = useRef(null);

  // όταν γίνει select και το parent βάλει value=label, το effect θα ξανατρέξει.
  // αυτό το flag λέει "μην κάνεις fetch γι' αυτό το change".
  const justSelectedRef = useRef(false);

  const normalized = (debounced || "").trim();
  const canSearch = useMemo(() => normalized.length >= 3, [normalized]);

  useEffect(() => {
    // Skip the fetch cycle right after a selection
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // Reset list when less than 3 chars
    if (!canSearch) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      setApiError("");
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // If a placeId is already selected, don't fetch suggestions for the full label.
    // We only fetch again after user starts typing (onChange clears selectedPlaceId in parent).
    if (selectedPlaceId) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      setApiError("");
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setApiError("");

    fetchAreas(normalized, controller.signal)
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setOpen(true);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setApiError(e.message || "Failed to fetch suggestions");
        setItems([]);
        setOpen(false);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [normalized, canSearch, selectedPlaceId]);

  function handleSelect(item) {
    const label = item.secondaryText ? `${item.mainText}, ${item.secondaryText}` : item.mainText;

    // locked that selection was made so that the next value change would not fetch
    justSelectedRef.current = true;

    // stop any inflight request and clear transient API errors
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
    setApiError("");
    setItems([]);
    setOpen(false);

    onSelect({ placeId: item.placeId, label });
  }

  const showApiError = !loading && canSearch && apiError && !selectedPlaceId;

  return (
    <div className="area-field" style={{ position: "relative" }}>
      <label>
        Area <span style={{ color: "crimson" }}>*</span>
      </label>

      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(false);
          justSelectedRef.current = false;
        }}
        onFocus={() => {
          if (items.length > 0 && !selectedPlaceId) setOpen(true);
        }}
        placeholder="Type in the property's area..."
        className={`area-input ${error ? "is-error" : ""}`}
      />

      <div className="area-help">
        {loading && <span>Loading…</span>}
        {showApiError && <span className="text-error">{apiError}</span>}
        {!loading && error && <span className="text-error">{error}</span>}
        {!loading && !canSearch && value.trim().length > 0 && (
          <span className="text-muted">Type at least 3 characters…</span>
        )}
      </div>

      {open && items.length > 0 && (
        <div className="area-dropdown">
          {items.map((it) => {
            return (
              <button
                key={it.placeId}
                type="button"
                onClick={() => handleSelect(it)}
                className="area-item"
              >
                <div className="area-item-main">{it.mainText}</div>
                {it.secondaryText && (
                  <div className="area-item-secondary">
                    {it.mainText}, {it.secondaryText}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

}
