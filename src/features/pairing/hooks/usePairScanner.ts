import type { FailureAction } from "../scannerMessage";
import { useClaimMac } from "./useClaimMac";
import { useLeaveWhenPaired } from "./useLeaveWhenPaired";
import { useSignInAgain } from "./useSignInAgain";

export function usePairScanner(onPaired: () => void) {
  const { state, scan, retry, scanAgain } = useClaimMac();
  const signIn = useSignInAgain();
  useLeaveWhenPaired(state.kind === "paired", onPaired);
  const actions: Record<FailureAction, () => void> = {
    tryAgain: retry,
    scanAgain,
    signIn: signIn.signInAgain,
  };
  return {
    state,
    scanning: state.kind === "scanning",
    scan,
    signingIn: signIn.pending,
    act: (action: FailureAction) => actions[action](),
  };
}
