import type { ErrorCode, RequestError } from "@getahoy/lib";
import { getNetworkStateAsync } from "expo-network";
import type { TalkFailure } from "../talkState";

const apiFailures: Partial<Record<ErrorCode, TalkFailure>> = {
  nothing_heard: "nothingHeard",
  rate_limited: "rateLimited",
  unauthorized: "signedOut",
};

export async function uploadFailure(error: RequestError): Promise<TalkFailure> {
  if (error.kind === "api") {
    return apiFailures[error.detail.code] ?? "transcribeFailed";
  }
  if (error.kind !== "network") return "transcribeFailed";
  const network = await getNetworkStateAsync().catch(() => null);
  const offline =
    network?.isConnected === false || network?.isInternetReachable === false;
  return offline ? "offline" : "transcribeFailed";
}
