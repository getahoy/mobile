import { request } from "@getahoy/lib";
import {
  type PairingClaimRequest,
  type PairingUnlinkRequest,
  pairingClaimSchema,
  pairingLinksSchema,
  pairingUnlinkSchema,
} from "@getahoy/protocol";
import type { z } from "zod";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

// fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
const fetchWithOwnCookie: typeof fetch = (input, init) =>
  fetch(input, { ...init, credentials: "omit" });

type SessionCall<T> = {
  url: URL;
  schema: z.ZodType<T>;
  body?: unknown;
};

async function withSession<T>({ url, schema, body }: SessionCall<T>) {
  const cookie = await authClient.getCookie();
  const headers = { cookie };
  const call = {
    url: url.toString(),
    headers,
    schema,
    fetch: fetchWithOwnCookie,
  };
  if (body === undefined) return request(call);
  return request({ ...call, method: "POST", body });
}

const apiUrl = (path: string) => new URL(path, publicEnv.EXPO_PUBLIC_API_URL);

export function claimPairing(body: PairingClaimRequest) {
  const url = apiUrl("/api/pairing/claim");
  return withSession({ url, body, schema: pairingClaimSchema });
}

export function unlinkPairing(body: PairingUnlinkRequest) {
  const url = apiUrl("/api/pairing/unlink");
  return withSession({ url, body, schema: pairingUnlinkSchema });
}

export function listPairingLinks(device: string) {
  const url = apiUrl("/api/pairing/links");
  url.searchParams.set("device", device);
  return withSession({ url, schema: pairingLinksSchema });
}
