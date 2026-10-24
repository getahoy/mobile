import { request } from "@getahoy/lib";
import {
  type PairingClaimRequest,
  type PairingUnlinkRequest,
  pairingClaimSchema,
  pairingUnlinkSchema,
} from "@getahoy/protocol";
import type { z } from "zod";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

async function postWithSession<T>(
  path: string,
  body: unknown,
  schema: z.ZodType<T>,
) {
  const cookie = await authClient.getCookie();
  return request({
    url: new URL(path, publicEnv.EXPO_PUBLIC_API_URL).toString(),
    method: "POST",
    body,
    headers: { cookie },
    schema,
  });
}

export function claimPairing(body: PairingClaimRequest) {
  return postWithSession("/api/pairing/claim", body, pairingClaimSchema);
}

export function unlinkPairing(body: PairingUnlinkRequest) {
  return postWithSession("/api/pairing/unlink", body, pairingUnlinkSchema);
}
