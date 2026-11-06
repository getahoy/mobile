import { type RequestResult, request } from "@getahoy/lib";
import type { z } from "zod";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "./authClient";

// fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
const fetchWithOwnCookie: typeof fetch = (input, init) =>
  fetch(input, { ...init, credentials: "omit" });

type SessionCall<T> = {
  path: string;
  schema: z.ZodType<T>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Readonly<Record<string, string>>;
};

export async function sessionRequest<T>(
  call: SessionCall<T>,
): Promise<RequestResult<T>> {
  const url = new URL(call.path, publicEnv.EXPO_PUBLIC_API_URL);
  for (const [name, text] of Object.entries(call.query ?? {})) {
    url.searchParams.set(name, text);
  }
  const cookie = await authClient.getCookie();
  const method = call.method ?? (call.body === undefined ? "GET" : "POST");
  return request({
    url: url.toString(),
    headers: { cookie },
    schema: call.schema,
    fetch: fetchWithOwnCookie,
    method,
    ...(call.body === undefined ? {} : { body: call.body }),
  });
}
