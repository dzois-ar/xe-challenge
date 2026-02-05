import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAd } from "../api/ads";

export function AdDetailsPage() {
  // Read the ad id from the URL
  const { id } = useParams();

  // Local state for the ad data and possible error
  const [ad, setAd] = useState(null);
  const [error, setError] = useState("");

  // Fetch ad details when the component mounts or id changes
  useEffect(() => {
    getAd(id)
      .then(setAd)
      .catch((e) => setError(e.message || "Failed to load"));
  }, [id]);
  
  // Show error message if the request failed
  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <p style={{ color: "crimson" }}>{error}</p>
        <Link to="/">Back</Link>
      </div>
    );
  }
  
   // Show loading state while data is being fetched
  if (!ad) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <Link to="/">← Create another</Link>
      <h1 style={{ fontSize: 26, marginTop: 10 }}>{ad.title}</h1>

      <div style={{ marginTop: 14, padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
        <div><b>Type:</b> {ad.type}</div>
        <div><b>Area:</b> {ad.area.label}</div>
        <div><b>Price in Euros:</b> {ad.price} €</div>
        <div>
          <b>Created:</b>{" "}
          {new Date(ad.createdAt).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </div>

      </div>

      {ad.description && (
        <div style={{ marginTop: 14 }}>
          <h3>Description:</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{ad.description}</p>
        </div>
      )}
    </div>
  );
}
