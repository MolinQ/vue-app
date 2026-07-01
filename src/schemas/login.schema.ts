import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod/v3";

const authSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .trim()
      .nonempty("Email is required")
      .email("Invalid email"),

    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
);

export default authSchema;
