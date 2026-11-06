import type { HistoryEntry } from "@getahoy/protocol";
import { router } from "expo-router";
import { entryMeta, sectionsByDay, timeLabel } from "../historyView";
import type { HistoryScreenState } from "../hooks/useHistoryScreen";
import { HistoryList } from "./historyList";
import { HistoryListBlank } from "./historyListBlank";
import { HistoryListFooter } from "./historyListFooter";
import { HistoryListTop } from "./historyListTop";
import { HistoryRow } from "./historyRow";

const openEntry = (id: string) =>
  router.push({ pathname: "/history/[id]", params: { id } });

export function HistoryFeed({ screen }: { screen: HistoryScreenState }) {
  const { history, blank, showMac } = screen;
  const { list, search, filter, unsynced } = history;
  const row = (entry: HistoryEntry) => (
    <HistoryRow
      entry={entry}
      time={timeLabel(new Date(entry.startedAt))}
      meta={entryMeta({ entry, unsynced, showMac })}
      onOpen={openEntry}
    />
  );
  const retry = () => void list.reload();
  return (
    <HistoryList
      sections={sectionsByDay(history.entries, new Date())}
      top={
        <HistoryListTop
          notice={screen.notice}
          summary={screen.summary}
          search={search}
          filter={filter}
          onSearch={history.setSearch}
          onFilter={history.setFilter}
        />
      }
      blank={
        blank ? (
          <HistoryListBlank kind={blank} search={search} onRetry={retry} />
        ) : null
      }
      footer={
        <HistoryListFooter
          loadingMore={list.loadingMore}
          canClear={screen.canClear}
          onClear={() => screen.setSheet("clear")}
        />
      }
      renderEntry={row}
      onEndReached={() => void list.loadMore()}
    />
  );
}
