import { apiPaths, type SpeakVoice } from "@getahoy/protocol";
import { sessionClient } from "@/features/auth/client/sessionClient";

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
  const url = sessionClient.url(apiPaths.speak);
  try {
    const headers = await sessionClient.headers();
    const response = await fetch(url, {
      method: "POST",
      credentials: OWN_COOKIE_ONLY,
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({ text, voice }),
      signal,
    });
    if (!response.ok) return { kind: "failed", reason: "http" };
    return { kind: "audio", bytes: await response.arrayBuffer() };
  } catch {
    return { kind: "failed", reason: signal.aborted ? "stopped" : "offline" };
  }
}
