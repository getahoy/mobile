import { type ErrorCode, errorMessages } from "@getahoy/lib";
import { type AuthCopyKey, authCopy } from "../copy/authCopy";

function isAuthCopyKey(key: string): key is AuthCopyKey {
  return key in authCopy;
}

export function authErrorMessage(code: ErrorCode): string {
  const key = `error.${code}`;
  return isAuthCopyKey(key) ? authCopy[key] : errorMessages[code];
}
