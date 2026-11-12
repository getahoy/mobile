import { noticeShown, parseStored } from "@getahoy/lib";
import { endReasonSchema } from "@getahoy/protocol";
import { createMMKV, useMMKVString } from "react-native-mmkv";
import { z } from "zod";
import type { EndedNotice } from "../endedPairing";

const ENDED_NOTICE_KEY = "pairing.endedNotice";

const endedNoticeStorage = createMMKV({ id: "ahoy.endedNotice" });

const endedNoticeSchema: z.ZodType<EndedNotice> = z.object({
  deviceName: z.string(),
  reason: endReasonSchema,
  at: z.int(),
  whileClosed: z.boolean(),
});

export function saveEndedNotice(notice: EndedNotice): void {
  endedNoticeStorage.set(ENDED_NOTICE_KEY, JSON.stringify(notice));
}

export function clearEndedNotice(): void {
  endedNoticeStorage.remove(ENDED_NOTICE_KEY);
}

export function useEndedNotice() {
  const [text] = useMMKVString(ENDED_NOTICE_KEY, endedNoticeStorage);
  const notice = parseStored(endedNoticeSchema, text);
  const shown = notice && noticeShown(notice, Date.now()) ? notice : null;
  return { notice: shown, dismiss: clearEndedNotice };
}
