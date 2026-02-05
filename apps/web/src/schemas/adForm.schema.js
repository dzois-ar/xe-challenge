import { z } from "zod";

// Allowed ad types
export const AdTypeEnum = z.enum(["Rent", "Buy", "Exchange", "Donation"]);

// Form validation schema
export const AdFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(155, "Max 155 characters"),

  // Ad type (cannot be empty – useful for select inputs)
  type: AdTypeEnum.or(z.literal("")).refine((v) => v !== "", {
    message: "Select a type",
  }),

   // Human-readable area name
  areaLabel: z.string().min(1, "Area is required"),

   // Area identifier 
  areaPlaceId: z.string().min(1, "Area selection is required"),

   // Price (required, non-negative integer)
  // NaN values are converted to undefined to trigger "required" error
  price: z.preprocess(
    (v) => (typeof v === "number" && Number.isNaN(v) ? undefined : v),
    z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Numbers only",
      })
      .int("Numbers only")
      .nonnegative("Must be >= 0")
  ),
  // Optional description (up to 5000 characters, empty string allowed)
   description: z.string().max(5000, "Max 5000 characters").optional().or(z.literal("")),
});


