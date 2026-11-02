import type { ErrorCode, RequestError } from "@getahoy/lib";

export type ClaimFailure =
  | "unreachable"
  | "alreadyUsed"
  | "rateLimited"
  | "signIn"
  | "updateApp"
  | "refused";

function serverFailure(code: ErrorCode): ClaimFailure {
  switch (code) {
    case "transient":
    case "internal":
    case "broken":
      return "unreachable";
    case "not_found":
    case "conflict":
      return "alreadyUsed";
    case "rate_limited":
      return "rateLimited";
    case "unauthorized":
    case "forbidden":
      return "signIn";
    case "protocol_version_mismatch":
      return "updateApp";
    case "invalid_input":
    case "device_revoked":
    case "blocked":
    case "nothing_heard":
      return "refused";
    default: {
      const unhandled: never = code;
      return unhandled;
    }
  }
}

export function claimFailure(error: RequestError): ClaimFailure {
  switch (error.kind) {
    case "network":
    case "malformed":
      return "unreachable";
    case "api":
      return serverFailure(error.detail.code);
    default: {
      const unhandled: never = error;
      return unhandled;
    }
  }
}

export function claimFailureCode(error: RequestError): string {
  return error.kind === "api" ? error.detail.code : error.kind;
}
