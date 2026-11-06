import { type HistoryWrite, historyWrittenSchema } from "@getahoy/protocol";
import { sessionRequest } from "@/features/auth/client/sessionRequest";

export function sendHistoryWrites(body: HistoryWrite) {
  const path = "/api/history";
  return sessionRequest({ path, body, schema: historyWrittenSchema });
}
