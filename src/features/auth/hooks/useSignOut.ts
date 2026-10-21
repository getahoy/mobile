import { useAuthRequest } from "@getahoy/lib";
import { authClient } from "../client/authClient";

export function useSignOut(onSuccess?: () => void) {
  const { pending, errorMessage, submit } = useAuthRequest();

  const signOut = () => submit(() => authClient.signOut(), onSuccess);

  return { pending, errorMessage, signOut };
}
