import { useAuthRequest } from "@getahoy/lib";
import { useConfirmSignOut } from "@/features/pairing/hooks/useConfirmSignOut";
import { authClient } from "../client/authClient";

export function useSignOut(onSuccess?: () => void) {
  const { pending, errorMessage, submit } = useAuthRequest();
  const { checking, confirmSignOut, request } = useConfirmSignOut();

  const signOut = () =>
    void confirmSignOut(() => submit(() => authClient.signOut(), onSuccess));

  return { pending, checking, errorMessage, signOut, request };
}
