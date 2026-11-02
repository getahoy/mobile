import { useState } from "react";
import { authClient } from "@/features/auth/client/authClient";

export function useSignInAgain() {
  const [pending, setPending] = useState(false);
  const signInAgain = async () => {
    setPending(true);
    await authClient.signOut().catch(() => undefined);
    setPending(false);
  };
  return { pending, signInAgain: () => void signInAgain() };
}
