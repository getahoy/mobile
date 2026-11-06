import {
  type HistoryQuery,
  type HistorySettings,
  type HistoryWrite,
  historyChangedSchema,
  historyPageSchema,
  historySettingsSchema,
  historyWrittenSchema,
} from "@getahoy/protocol";
import { sessionRequest } from "@/features/auth/client/sessionRequest";

const HISTORY = "/api/history";
const entryPath = (id: string) => `${HISTORY}/${encodeURIComponent(id)}`;

export function sendHistoryWrites(body: HistoryWrite) {
  return sessionRequest({ path: HISTORY, body, schema: historyWrittenSchema });
}

function urlQuery({ cursor, status, macKey }: HistoryQuery) {
  return {
    status,
    ...(cursor ? { cursor } : {}),
    ...(macKey ? { macKey } : {}),
  };
}

// Search text goes in a body: request URLs end up in server access logs.
export function fetchHistoryPage(query: HistoryQuery) {
  const schema = historyPageSchema;
  if (query.q) {
    const path = `${HISTORY}/search`;
    return sessionRequest({ path, body: query, schema });
  }
  return sessionRequest({ path: HISTORY, query: urlQuery(query), schema });
}

export function deleteHistoryEntry(id: string) {
  const path = entryPath(id);
  const schema = historyChangedSchema;
  return sessionRequest({ path, method: "DELETE", schema });
}

export function restoreHistoryEntry(id: string) {
  const path = `${entryPath(id)}/restore`;
  return sessionRequest({ path, method: "POST", schema: historyChangedSchema });
}

export function reportHistoryProblem(id: string, note: string) {
  const path = `${entryPath(id)}/report`;
  const body = note.trim() ? { note: note.trim() } : {};
  return sessionRequest({ path, body, schema: historyChangedSchema });
}

export function clearAllHistory() {
  const schema = historyChangedSchema;
  return sessionRequest({ path: HISTORY, method: "DELETE", schema });
}

export function readHistorySettings() {
  const path = `${HISTORY}/settings`;
  return sessionRequest({ path, schema: historySettingsSchema });
}

export function changeHistorySettings(body: HistorySettings) {
  const path = `${HISTORY}/settings`;
  const schema = historySettingsSchema;
  return sessionRequest({ path, method: "PATCH", body, schema });
}
