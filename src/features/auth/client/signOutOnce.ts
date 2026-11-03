import { createSignOutGuard } from "../signOutGuard";
import { authClient } from "./authClient";

export const signOutOnce = createSignOutGuard({
  readCookie: authClient.getCookie,
  signOut: () => authClient.signOut(),
});
