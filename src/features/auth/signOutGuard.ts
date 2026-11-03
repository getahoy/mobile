type SignOutGuardDeps = {
  readCookie: () => Promise<string>;
  signOut: () => Promise<unknown>;
};

// A sign-out answered by another rejection must not sign out again, and a
// cookie that cannot be read is never proof that the session is gone.
export function createSignOutGuard(
  deps: SignOutGuardDeps,
): () => Promise<void> {
  let signedOutCookie: string | null = null;
  return async () => {
    const cookie = await deps.readCookie().catch(() => "");
    if (cookie === "" || cookie === signedOutCookie) return;
    signedOutCookie = cookie;
    await deps.signOut();
  };
}
