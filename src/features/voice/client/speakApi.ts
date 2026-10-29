import type { SpeakVoice } from "@getahoy/protocol";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

export type SpeakAudio =
  | { kind: "audio"; bytes: ArrayBuffer }
  | { kind: "failed"; reason: "http" | "offline" | "stopped" };

// RN fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
const OWN_COOKIE_ONLY = "omit";

// Audio is not the JSON envelope, so this call cannot go through request().
export async function fetchSpeech(
  text: string,
  voice: SpeakVoice,
  signal: AbortSignal,
): Promise<SpeakAudio> {
  const url = new URL("/api/speak", publicEnv.EXPO_PUBLIC_API_URL);
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      credentials: OWN_COOKIE_ONLY,
      headers: {
        "content-type": "application/json",
        cookie: await authClient.getCookie(),
      },
      body: JSON.stringify({ text, voice }),
      signal,
    });
    if (!response.ok) return { kind: "failed", reason: "http" };
    return { kind: "audio", bytes: await response.arrayBuffer() };
  } catch {
    return { kind: "failed", reason: signal.aborted ? "stopped" : "offline" };
  }
}
