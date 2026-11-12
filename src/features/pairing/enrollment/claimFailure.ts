import { type FailureKind, failureKind, type RequestError } from "@getahoy/lib";

export type ClaimFailure =
  | "unreachable"
  | "alreadyUsed"
  | "rateLimited"
  | "signIn"
  | "updateApp"
  | "refused";

const claimFailures: Record<FailureKind, ClaimFailure> = {
  offline: "unreachable",
  server: "unreachable",
  notFound: "alreadyUsed",
  conflict: "alreadyUsed",
  rateLimited: "rateLimited",
  signedOut: "signIn",
  updateNeeded: "updateApp",
  refused: "refused",
};

export function claimFailure(error: RequestError): ClaimFailure {
  return claimFailures[failureKind(error)];
}

export function claimFailureCode(error: RequestError): string {
  return error.kind === "api" ? error.detail.code : error.kind;
}
