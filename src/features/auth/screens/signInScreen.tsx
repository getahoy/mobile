import { authClient } from "../client/authClient";
import { authCopy } from "../copy/authCopy";
import { signInFields } from "../forms/credentialFields";
import { signInSchema } from "../forms/credentialsSchema";
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
