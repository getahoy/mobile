import { authClient } from "../client/authClient";
import { authCopy } from "../copy/authCopy";
import { signUpFields } from "../forms/credentialFields";
import { signUpSchema } from "../forms/credentialsSchema";
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
