import {
  apiPaths,
  type HistoryQuery,
  type HistorySettings,
  type HistoryWrite,
  historyChangedSchema,
  historyPageSchema,
  historySettingsSchema,
  historyWrittenSchema,
} from "@getahoy/protocol";
import { sessionRequest } from "@/features/auth/client/sessionRequest";

export function sendHistoryWrites(body: HistoryWrite) {
  const path = apiPaths.history;
  return sessionRequest({ path, body, schema: historyWrittenSchema });
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
    const path = apiPaths.historySearch;
    return sessionRequest({ path, body: query, schema });
  }
  const path = apiPaths.history;
  return sessionRequest({ path, query: urlQuery(query), schema });
}

export function deleteHistoryEntry(id: string) {
  const path = apiPaths.historyEntry(id);
  const schema = historyChangedSchema;
  return sessionRequest({ path, method: "DELETE", schema });
}

export function restoreHistoryEntry(id: string) {
  const path = apiPaths.historyRestore(id);
  return sessionRequest({ path, method: "POST", schema: historyChangedSchema });
}

export function reportHistoryProblem(id: string, note: string) {
  const path = apiPaths.historyReport(id);
  const body = note.trim() ? { note: note.trim() } : {};
  return sessionRequest({ path, body, schema: historyChangedSchema });
}

export function clearAllHistory() {
  const path = apiPaths.history;
  const schema = historyChangedSchema;
  return sessionRequest({ path, method: "DELETE", schema });
}

export function readHistorySettings() {
  const path = apiPaths.historySettings;
  return sessionRequest({ path, schema: historySettingsSchema });
}

export function changeHistorySettings(body: HistorySettings) {
  const path = apiPaths.historySettings;
  const schema = historySettingsSchema;
  return sessionRequest({ path, method: "PATCH", body, schema });
}
