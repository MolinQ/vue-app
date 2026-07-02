import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod/v3";

const registerSchema = toTypedSchema(
  z
    .object({
      login: z
        .string()
        .trim()
        .nonempty("Login is required")
        .min(3, "Login must be at least 3 characters")
        .max(30, "Login must be at most 30 characters"),

      name: z
        .string()
        .trim()
        .nonempty("Display name is required")
        .min(2, "Display name must be at least 2 characters")
        .max(50, "Display name must be at most 50 characters"),

      password: z
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters"),

      confirmPassword: z.string().nonempty("Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
);

export default registerSchema;
