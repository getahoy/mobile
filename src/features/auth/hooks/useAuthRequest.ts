import { useState, useTransition } from "react";
import { type AuthError, toErrorCode } from "../errors/authErrorCode";
import { authErrorMessage } from "../errors/authErrorMessage";

export type AuthResponse = { error: AuthError | null };

export type AuthRequest = () => Promise<AuthResponse>;

const NETWORK_FAILURE: AuthError = { status: 0 };

async function runSafely(request: AuthRequest): Promise<AuthResponse> {
  try {
    return await request();
  } catch {
    return { error: NETWORK_FAILURE };
  }
}

export function useAuthRequest() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (request: AuthRequest, onSuccess?: () => void) =>
    startTransition(async () => {
      setErrorMessage(null);
      const { error } = await runSafely(request);
      if (error) return setErrorMessage(authErrorMessage(toErrorCode(error)));
      onSuccess?.();
    });

  return { pending, errorMessage, submit, showError: setErrorMessage };
}
