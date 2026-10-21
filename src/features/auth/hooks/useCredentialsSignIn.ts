import { parseInput } from "@getahoy/lib";
import { type SignInInput, signInSchema } from "../forms/credentialsSchema";
import { type AuthResponse, useAuthRequest } from "./useAuthRequest";
import { useCredentialValues } from "./useCredentialValues";

export type SignInFieldName = keyof SignInInput;

export type UseCredentialsSignInOptions = {
  signIn: (input: SignInInput) => Promise<AuthResponse>;
  onSuccess: () => void;
};

export function useCredentialsSignIn({
  signIn,
  onSuccess,
}: UseCredentialsSignInOptions) {
  const { values, setField } = useCredentialValues<SignInFieldName>();
  const { pending, errorMessage, submit, showError } = useAuthRequest();

  const submitSignIn = () => {
    const form = parseInput(signInSchema, values);
    if (form.outcome === "invalid") return showError(form.message);
    submit(() => signIn(form.input), onSuccess);
  };

  return { values, setField, pending, errorMessage, submit: submitSignIn };
}
