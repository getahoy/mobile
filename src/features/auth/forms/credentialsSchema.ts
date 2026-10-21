import { z } from "zod";
import { authCopy } from "../copy/authCopy";

const MINIMUM_PASSWORD_LENGTH = 8;

const emailField = z.email(authCopy["validation.email"]);

const passwordLengthMessage = authCopy["validation.passwordLength"].replace(
  "{minimum}",
  String(MINIMUM_PASSWORD_LENGTH),
);

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, authCopy["validation.password"]),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, authCopy["validation.name"]),
  email: emailField,
  password: z.string().min(MINIMUM_PASSWORD_LENGTH, passwordLengthMessage),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
