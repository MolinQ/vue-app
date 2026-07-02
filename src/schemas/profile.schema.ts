import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod/v3";

const profileSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .trim()
      .nonempty("Display name is required")
      .min(2, "Display name must be at least 2 characters")
      .max(50, "Display name must be at most 50 characters"),
  }),
);

export default profileSchema;
