import { parseInput } from "@getahoy/lib";
import { type SignUpInput, signUpSchema } from "../forms/credentialsSchema";
import { type AuthResponse, useAuthRequest } from "./useAuthRequest";
import { useCredentialValues } from "./useCredentialValues";

export type SignUpFieldName = keyof SignUpInput;

export type UseCredentialsSignUpOptions = {
  signUp: (input: SignUpInput) => Promise<AuthResponse>;
  onSuccess: () => void;
};

export function useCredentialsSignUp({
  signUp,
  onSuccess,
}: UseCredentialsSignUpOptions) {
  const { values, setField } = useCredentialValues<SignUpFieldName>();
  const { pending, errorMessage, submit, showError } = useAuthRequest();

  const submitSignUp = () => {
    const form = parseInput(signUpSchema, values);
    if (form.outcome === "invalid") return showError(form.message);
    submit(() => signUp(form.input), onSuccess);
  };

  return { values, setField, pending, errorMessage, submit: submitSignUp };
}
