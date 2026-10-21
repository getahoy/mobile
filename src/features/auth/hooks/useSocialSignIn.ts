import { authCopy, type SocialProviderId, useAuthRequest } from "@getahoy/lib";
import { authClient } from "../client/authClient";

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
