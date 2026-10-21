import { authCopy, signUpSchema } from "@getahoy/lib";
import { authClient } from "../client/authClient";
import { signUpFields } from "../forms/credentialFields";
import { CredentialsScreen } from "./credentialsScreen";

export function SignUpScreen() {
  return (
    <CredentialsScreen
      title={authCopy["signUp.title"]}
      submitLabel={authCopy["signUp.submit"]}
      fields={signUpFields}
      schema={signUpSchema}
      request={(input) => authClient.signUp.email(input)}
      switchHref="/sign-in"
      switchLabel={authCopy["signUp.switch"]}
    />
  );
}
