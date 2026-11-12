import { apiPaths, speakVoicesSchema } from "@getahoy/protocol";
import { sessionClient } from "@/features/auth/client/sessionClient";
import { writeVoiceIds } from "../storage/voiceIds";

export async function refreshVoiceIds(): Promise<void> {
  const response = await sessionClient.call({
    path: apiPaths.speak,
    schema: speakVoicesSchema,
  });
  if (response.code === "success") writeVoiceIds(response.data.voices);
}
