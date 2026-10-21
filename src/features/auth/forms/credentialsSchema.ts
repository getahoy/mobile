import { z } from "zod";
import { authCopy, formatCopy } from "../copy/authCopy";

export const MINIMUM_PASSWORD_LENGTH = 8;

const emailField = z.email(authCopy["validation.email"]);

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, authCopy["validation.password"]),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, authCopy["validation.name"]),
  email: emailField,
  password: z.string().min(
    MINIMUM_PASSWORD_LENGTH,
    formatCopy("validation.passwordLength", {
      minimum: MINIMUM_PASSWORD_LENGTH,
    }),
  ),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
