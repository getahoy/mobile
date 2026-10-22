import {
  credentialFields,
  type SignInInput,
  type SignUpInput,
} from "@getahoy/lib";

export type CredentialField<Name extends string> = {
  name: Name;
  label: string;
  autoComplete: "name" | "email" | "current-password" | "new-password";
  textContentType: "name" | "emailAddress" | "password" | "newPassword";
  keyboardType: "default" | "email-address";
  secureTextEntry: boolean;
};

const textInput = { keyboardType: "default", secureTextEntry: false } as const;
const passwordInput = {
  keyboardType: "default",
  secureTextEntry: true,
} as const;
const emailInput = {
  textContentType: "emailAddress",
  keyboardType: "email-address",
  secureTextEntry: false,
} as const;

export const signInFields: readonly CredentialField<keyof SignInInput>[] = [
  { ...credentialFields.email, ...emailInput },
  {
    ...credentialFields.currentPassword,
    ...passwordInput,
    textContentType: "password",
  },
];

export const signUpFields: readonly CredentialField<keyof SignUpInput>[] = [
  { ...credentialFields.name, ...textInput, textContentType: "name" },
  { ...credentialFields.email, ...emailInput },
  {
    ...credentialFields.newPassword,
    ...passwordInput,
    textContentType: "newPassword",
  },
];
