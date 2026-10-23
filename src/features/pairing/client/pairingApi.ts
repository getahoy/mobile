import { request } from "@getahoy/lib";
import {
  type PairingClaimRequest,
  pairingClaimSchema,
} from "@getahoy/protocol";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

const CLAIM_PATH = "/api/pairing/claim";

export async function claimPairing(body: PairingClaimRequest) {
  const cookie = await authClient.getCookie();
  return request({
    url: new URL(CLAIM_PATH, publicEnv.EXPO_PUBLIC_API_URL).toString(),
    method: "POST",
    body,
    headers: { cookie },
    schema: pairingClaimSchema,
  });
}
