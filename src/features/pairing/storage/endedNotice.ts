import { endReasonSchema } from "@getahoy/protocol";
import { createMMKV, useMMKVString } from "react-native-mmkv";
import { z } from "zod";
import { type EndedNotice, noticeShown } from "../endedPairing";

const ENDED_NOTICE_KEY = "pairing.endedNotice";

const endedNoticeStorage = createMMKV({ id: "ahoy.endedNotice" });

const endedNoticeSchema: z.ZodType<EndedNotice> = z.object({
  macName: z.string(),
  reason: endReasonSchema,
  at: z.int(),
});

function parseNotice(text: string | undefined): EndedNotice | null {
  if (text === undefined) return null;
  try {
    const parsed = endedNoticeSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveEndedNotice(notice: EndedNotice): void {
  endedNoticeStorage.set(ENDED_NOTICE_KEY, JSON.stringify(notice));
}

export function clearEndedNotice(): void {
  endedNoticeStorage.remove(ENDED_NOTICE_KEY);
}

export function useEndedNotice() {
  const [text] = useMMKVString(ENDED_NOTICE_KEY, endedNoticeStorage);
  const notice = parseNotice(text);
  const shown = notice && noticeShown(notice, Date.now()) ? notice : null;
  return { notice: shown, dismiss: clearEndedNotice };
}
