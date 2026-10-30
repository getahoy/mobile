import { request } from "@getahoy/lib";
import { speakVoicesSchema } from "@getahoy/protocol";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";
import { writeVoiceIds } from "../storage/voiceIds";

// fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
const fetchWithOwnCookie: typeof fetch = (input, init) =>
  fetch(input, { ...init, credentials: "omit" });

export async function refreshVoiceIds(): Promise<void> {
  const url = new URL("/api/speak", publicEnv.EXPO_PUBLIC_API_URL);
  const response = await request({
    url: url.toString(),
    headers: { cookie: await authClient.getCookie() },
    schema: speakVoicesSchema,
    fetch: fetchWithOwnCookie,
  });
  if (response.code === "success") writeVoiceIds(response.data.voices);
}
