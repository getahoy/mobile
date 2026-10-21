export const authCopy = {
  "signIn.title": "Sign in",
  "signIn.submit": "Sign in",
  "signIn.switch": "Create an account",
  "signUp.title": "Create your account",
  "signUp.submit": "Create account",
  "signUp.switch": "I already have an account",
  "account.title": "Your account",
  "account.loading": "Loading your account…",
  "session.loading": "Checking your session",
  "signOut.submit": "Sign out",
  "signOut.pending": "Signing out…",
  "form.pending": "Please wait…",
  "field.name": "Name",
  "field.email": "Email",
  "field.password": "Password",
  "social.google": "Continue with Google",
  "validation.name": "Enter your name",
  "validation.email": "Enter a valid email address",
  "validation.password": "Enter your password",
  "validation.passwordLength": "Use at least {minimum} characters",
  "error.unauthorized": "Email or password is incorrect.",
  "error.conflict": "An account with this email already exists.",
  "error.forbidden": "Verify your email before signing in.",
} as const;

export type AuthCopyKey = keyof typeof authCopy;

export function formatCopy(
  key: AuthCopyKey,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce<string>(
    (text, [name, replacement]) =>
      text.replace(`{${name}}`, String(replacement)),
    authCopy[key],
  );
}
