import { type ErrorCode, errorMessages } from "@getahoy/lib";
import { authCopy } from "../copy/authCopy";

export type AuthError = {
  code?: string | undefined;
  status?: number | undefined;
};

const codesByAuthError: Record<string, ErrorCode> = {
  INVALID_EMAIL_OR_PASSWORD: "unauthorized",
  INVALID_PASSWORD: "unauthorized",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "unauthorized",
  SESSION_EXPIRED: "unauthorized",
  USER_ALREADY_EXISTS: "conflict",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "conflict",
  INVALID_EMAIL: "invalid_input",
  PASSWORD_TOO_SHORT: "invalid_input",
  PASSWORD_TOO_LONG: "invalid_input",
  EMAIL_NOT_VERIFIED: "forbidden",
  USER_NOT_FOUND: "not_found",
};

const authMessages: Partial<Record<ErrorCode, string>> = {
  unauthorized: authCopy["error.unauthorized"],
  conflict: authCopy["error.conflict"],
  forbidden: authCopy["error.forbidden"],
};

const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR = 500;

function codeForStatus(status: number | undefined): ErrorCode {
  if (status === undefined || status === 0) return "transient";
  if (status === HTTP_TOO_MANY_REQUESTS) return "rate_limited";
  if (status >= HTTP_SERVER_ERROR) return "broken";
  return "internal";
}

export function authErrorMessage({ code, status }: AuthError): string {
  const errorCode =
    (code ? codesByAuthError[code] : undefined) ?? codeForStatus(status);
  return authMessages[errorCode] ?? errorMessages[errorCode];
}
