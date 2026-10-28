import { type RequestResult, request } from "@getahoy/lib";
import {
  AUDIO_UPLOAD_FIELD,
  type TranscribeResponse,
  transcribeResponseSchema,
} from "@getahoy/protocol";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

const TRANSCRIBE_TIMEOUT_MS = 30_000;

const NETWORK_FAILURE: RequestResult<never> = {
  code: "error",
  error: { kind: "network" },
};

// expo/fetch sends the native cookie jar by default; merged with our cookie header it corrupts the session cache cookie.
const fetchWithOwnCookie: typeof fetch = (input, init) =>
  fetch(input, { ...init, credentials: "omit" });

async function upload(uri: string) {
  const form = new FormData();
  form.append(AUDIO_UPLOAD_FIELD, new File(uri));
  const url = new URL("/api/transcribe", publicEnv.EXPO_PUBLIC_API_URL);
  return request({
    url: url.toString(),
    method: "POST",
    form,
    fetch: fetchWithOwnCookie,
    headers: { cookie: await authClient.getCookie() },
    schema: transcribeResponseSchema,
    timeoutMs: TRANSCRIBE_TIMEOUT_MS,
  });
}

export function transcribeRecording(
  uri: string,
): Promise<RequestResult<TranscribeResponse>> {
  return upload(uri).catch(() => NETWORK_FAILURE);
}
