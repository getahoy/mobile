import { authClient } from "../client/authClient";
import { authCopy } from "../copy/authCopy";
import type { SocialProviderId } from "../providers/socialProviderCatalog";
import { useAuthRequest } from "./useAuthRequest";

export function useSocialSignIn() {
  const { pending, errorMessage, submit, showError } = useAuthRequest();

  const showErrorIfSignedOut = async () => {
    const { data } = await authClient.getSession();
    if (!data) showError(authCopy["error.social"]);
  };

  const signInWith = (provider: SocialProviderId) =>
    submit(
      () =>
        authClient.signIn.social({
          provider,
          callbackURL: "/",
          errorCallbackURL: "/sign-in",
        }),
      showErrorIfSignedOut,
    );

  return { pending, errorMessage, signInWith };
}
