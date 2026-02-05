import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdFormSchema } from "../schemas/adForm.schema";
import { AreaAutocomplete } from "../components/AreaAutocomplete";
import { createAd } from "../api/ads";
import { useNavigate } from "react-router-dom";

// Page for creating a new property classified
export function NewAdPage() {
  const navigate = useNavigate();

  // Holds backend error message 
  const [serverError, setServerError] = useState("");
 
  // React Hook Form setup with Zod validation schema
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(AdFormSchema),
    defaultValues: {
      title: "",
      type: "",
      areaLabel: "",
      areaPlaceId: "",
      price: undefined,
      description: ""
    }
  });

  // Watch area label to keep AreaAutocomplete controlled
  const areaLabel = watch("areaLabel");

  // Called when the form is submitted successfully
  async function onSubmit(values) {
    setServerError("");

    // transform form state into backend payload
    const payload = {
      title: values.title,
      type: values.type,
      area: { placeId: values.areaPlaceId, label: values.areaLabel },
      price: values.price,
      description: values.description 
    };

    try {
       // Create ad via API
      const created = await createAd(payload);

      // Redirect to ad details page
      navigate(`/ads/${created.id}`);
    } catch (e) {
      // Show server-side error
      setServerError(e.message || "Failed to submit");
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>New property classified</h1>
      <p style={{ color: "#555", marginBottom: 20 }}>
        Fill in the details below. Fields marked with * are required.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label >
            Title <span style={{ color: "crimson" }}>*</span>
          </label>
          <input
            {...register("title")}
            placeholder="Classified title up to 155 chars"
            className={`form-control ${errors.title ? "is-error" : ""}`}
          />
          {errors.title && <div style={{ color: "crimson", fontSize: 12 }}>{errors.title.message}</div>}
        </div>

        <div className="form-field">
          <label>
            Type <span style={{ color: "crimson" }}>*</span>
          </label>
          <select
            {...register("type")}
            className={`form-control  ${errors.type ? "is-error" : ""}`}
            defaultValue=""
          > 
            <option value=""disabled hidden>Select Type</option>
            <option value="Rent">Rent</option>
            <option value="Buy">Buy</option>
            <option value="Exchange">Exchange</option>
            <option value="Donation">Donation</option>
          
          </select>
          {errors.type && <div style={{ color: "crimson", fontSize: 12 }}>{errors.type.message}</div>}
        </div>

        <AreaAutocomplete
          value={areaLabel}
          onChange={(text) => {
            setValue("areaLabel", text, { shouldValidate: true });
            // clear placeId until they select again
            setValue("areaPlaceId", "", { shouldValidate: true });
          }}
          onSelect={({ placeId, label }) => {
            setValue("areaLabel", label, { shouldValidate: true });
            setValue("areaPlaceId", placeId, { shouldValidate: true });
          }}
          error={errors.areaLabel?.message || errors.areaPlaceId?.message}
        />

        <div className="form-field">
          <label>
            Price in Euros <span style={{ color: "crimson" }}>*</span>
          </label>
         <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Amount"
            className={`form-control ${errors.price ? "is-error" : ""}`}
            />
            {errors.price && <div style={{ color: "crimson", fontSize: 12 }}>{errors.price.message}</div>}
        </div>

        <div className="form-field">
          <label>
            Extra description
          </label>
          <textarea
            {...register("description")}
            rows={4} 
            placeholder="Type here"
            className="form-control"
          />
        </div>

        {serverError && (
          <div style={{ padding: 12, borderRadius: 10, background: "#ffe9ea", color: "#8a0010" }}>
            {serverError}
          </div>
        )}

     <div className="form-actions">
        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>

      </form>
    </div>
  );
}
