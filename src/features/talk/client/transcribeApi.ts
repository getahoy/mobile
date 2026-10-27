import { request } from "@getahoy/lib";
import {
  AUDIO_UPLOAD_FIELD,
  transcribeResponseSchema,
} from "@getahoy/protocol";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { publicEnv } from "@/env/publicEnv";
import { authClient } from "@/features/auth/client/authClient";

const TRANSCRIBE_TIMEOUT_MS = 30_000;

export async function transcribeRecording(uri: string) {
  const form = new FormData();
  form.append(AUDIO_UPLOAD_FIELD, new File(uri));
  const url = new URL("/api/transcribe", publicEnv.EXPO_PUBLIC_API_URL);
  return request({
    url: url.toString(),
    method: "POST",
    form,
    fetch,
    headers: { cookie: await authClient.getCookie() },
    schema: transcribeResponseSchema,
    timeoutMs: TRANSCRIBE_TIMEOUT_MS,
  });
}
