import {
  type AuthRequestState,
  authCopy,
  type SocialProviderId,
} from "@getahoy/lib";
import { authClient } from "../client/authClient";

export function useSocialSignIn(authRequest: AuthRequestState) {
  const showErrorIfSignedOut = async () => {
    const { data } = await authClient
      .getSession()
      .catch(() => ({ data: null }));
    if (!data) authRequest.showError(authCopy["error.social"]);
  };

  const signInWith = (provider: SocialProviderId) =>
    authRequest.submit(
      () =>
        authClient.signIn.social({
          provider,
          callbackURL: "/",
          errorCallbackURL: "/sign-in",
        }),
      showErrorIfSignedOut,
    );

  return { signInWith };
}
