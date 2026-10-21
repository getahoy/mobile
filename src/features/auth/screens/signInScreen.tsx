import { authCopy, signInSchema } from "@getahoy/lib";
import { authClient } from "../client/authClient";
import { signInFields } from "../forms/credentialFields";
import { CredentialsScreen } from "./credentialsScreen";

export function SignInScreen() {
  return (
    <CredentialsScreen
      title={authCopy["signIn.title"]}
      submitLabel={authCopy["signIn.submit"]}
      fields={signInFields}
      schema={signInSchema}
      request={(input) => authClient.signIn.email(input)}
      switchHref="/sign-up"
      switchLabel={authCopy["signIn.switch"]}
    />
  );
}
