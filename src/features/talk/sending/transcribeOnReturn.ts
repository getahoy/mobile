import { transcribeRecording } from "../client/transcribeApi";
import { type AppActivity, untilActive, watchLeaving } from "./appActivity";

// An upload cut off while the app was away gets one more try on return; the
// recording is still on disk.
export async function transcribeOnReturn(uri: string, activity: AppActivity) {
  const leftDuringUpload = watchLeaving(activity);
  const first = await transcribeRecording(uri);
  if (first.code === "success" || !leftDuringUpload()) return first;
  await untilActive(activity);
  return transcribeRecording(uri);
}
