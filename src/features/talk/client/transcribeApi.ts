import type { RequestResult } from "@getahoy/lib";
import {
  AUDIO_UPLOAD_FIELD,
  apiPaths,
  type TranscribeResponse,
  transcribeResponseSchema,
} from "@getahoy/protocol";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { sessionClientOver } from "@/features/auth/client/sessionClient";

const TRANSCRIBE_TIMEOUT_MS = 30_000;

const NETWORK_FAILURE: RequestResult<never> = {
  code: "error",
  error: { kind: "network" },
};

const uploadClient = sessionClientOver(fetch);

function upload(uri: string) {
  const form = new FormData();
  form.append(AUDIO_UPLOAD_FIELD, new File(uri));
  return uploadClient.call({
    path: apiPaths.transcribe,
    form,
    schema: transcribeResponseSchema,
    timeoutMs: TRANSCRIBE_TIMEOUT_MS,
  });
}

export function transcribeRecording(
  uri: string,
): Promise<RequestResult<TranscribeResponse>> {
  return upload(uri).catch(() => NETWORK_FAILURE);
}
