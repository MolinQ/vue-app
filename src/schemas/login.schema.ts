import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod/v3";

const authSchema = toTypedSchema(
  z.object({
    login: z
      .string()
      .trim()
      .nonempty("Login is required")
      .min(3, "Login must be at least 3 characters"),

    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
);

export default authSchema;
