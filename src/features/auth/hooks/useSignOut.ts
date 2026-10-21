import { type AuthResponse, useAuthRequest } from "./useAuthRequest";

export type UseSignOutOptions = {
  signOut: () => Promise<AuthResponse>;
  onSuccess: () => void;
};

export function useSignOut({ signOut, onSuccess }: UseSignOutOptions) {
  const { pending, errorMessage, submit } = useAuthRequest();

  const submitSignOut = () => submit(signOut, onSuccess);

  return { pending, errorMessage, submit: submitSignOut };
}
