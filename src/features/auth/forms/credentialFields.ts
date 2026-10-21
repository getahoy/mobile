import { authCopy, type SignInInput, type SignUpInput } from "@getahoy/lib";

export type CredentialField<Name extends string> = {
  name: Name;
  label: string;
  autoComplete: "name" | "email" | "current-password" | "new-password";
  textContentType: "name" | "emailAddress" | "password" | "newPassword";
  keyboardType: "default" | "email-address";
  secureTextEntry: boolean;
};

const nameField: CredentialField<"name"> = {
  name: "name",
  label: authCopy["field.name"],
  autoComplete: "name",
  textContentType: "name",
  keyboardType: "default",
  secureTextEntry: false,
};

const emailField: CredentialField<"email"> = {
  name: "email",
  label: authCopy["field.email"],
  autoComplete: "email",
  textContentType: "emailAddress",
  keyboardType: "email-address",
  secureTextEntry: false,
};

export const signInFields: readonly CredentialField<keyof SignInInput>[] = [
  emailField,
  {
    name: "password",
    label: authCopy["field.password"],
    autoComplete: "current-password",
    textContentType: "password",
    keyboardType: "default",
    secureTextEntry: true,
  },
];

export const signUpFields: readonly CredentialField<keyof SignUpInput>[] = [
  nameField,
  emailField,
  {
    name: "password",
    label: authCopy["field.password"],
    autoComplete: "new-password",
    textContentType: "newPassword",
    keyboardType: "default",
    secureTextEntry: true,
  },
];
