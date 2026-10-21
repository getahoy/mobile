import { authClient } from "../client/authClient";
import { useAuthRequest } from "./useAuthRequest";

export function useSignOut(onSuccess?: () => void) {
  const { pending, errorMessage, submit } = useAuthRequest();

  const signOut = () => submit(() => authClient.signOut(), onSuccess);

  return { pending, errorMessage, signOut };
}
