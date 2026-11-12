import { createApiClient } from "@getahoy/lib";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "./authClient";

const sessionHeaders = async () => ({ cookie: await authClient.getCookie() });

// fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
export function sessionClientOver(send: typeof fetch) {
  return createApiClient({
    baseUrl: publicEnv.EXPO_PUBLIC_API_URL,
    headers: sessionHeaders,
    fetch: (input, init) => send(input, { ...init, credentials: "omit" }),
  });
}

export const sessionClient = sessionClientOver(fetch);
