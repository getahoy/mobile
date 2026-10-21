import type { SignInInput, SignUpInput } from "../forms/credentialsSchema";
import { authClient } from "./authClient";

export const signInWithEmail = (input: SignInInput) =>
  authClient.signIn.email(input);

export const signUpWithEmail = (input: SignUpInput) =>
  authClient.signUp.email(input);

export const signOut = () => authClient.signOut();
