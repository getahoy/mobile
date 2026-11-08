import type { HistoryEntry } from "@getahoy/protocol";
import { router } from "expo-router";
import { entryMeta, sectionsByDay, timeLabel } from "../historyView";
import type { HistoryScreenState } from "../hooks/useHistoryScreen";
import { HistoryList } from "./historyList";
import { HistoryListBlank } from "./historyListBlank";
import { HistoryListFooter } from "./historyListFooter";
import { HistoryListTop } from "./historyListTop";
import { HistoryLoading } from "./historyLoading";
import { HistoryRow } from "./historyRow";

const openEntry = (id: string) =>
  router.push({ pathname: "/history/[id]", params: { id } });

function listBlank({ firstLoad, blank, history }: HistoryScreenState) {
  if (firstLoad.showLoader) return <HistoryLoading busy={firstLoad.busy} />;
  if (!blank) return null;
  const retry = () => void history.list.reload();
  return (
    <HistoryListBlank kind={blank} search={history.search} onRetry={retry} />
  );
}

export function HistoryFeed({ screen }: { screen: HistoryScreenState }) {
  const { history, showMac } = screen;
  const { list, search, filter, unsynced } = history;
  const row = (entry: HistoryEntry) => (
    <HistoryRow
      entry={entry}
      time={timeLabel(new Date(entry.startedAt))}
      meta={entryMeta({ entry, unsynced, showMac })}
      onOpen={openEntry}
    />
  );
  return (
    <HistoryList
      sections={sectionsByDay(history.entries, new Date())}
      top={
        <HistoryListTop
          notice={screen.notice}
          summary={screen.summary}
          summaryPending={screen.summaryPending}
          search={search}
          filter={filter}
          onSearch={history.setSearch}
          onFilter={history.setFilter}
        />
      }
      blank={listBlank(screen)}
      footer={
        <HistoryListFooter
          loadingMore={list.loadingMore}
          canClear={screen.canClear}
          onClear={() => screen.setSheet("clear")}
        />
      }
      refreshing={history.refreshing}
      renderEntry={row}
      onEndReached={() => void list.loadMore()}
      onRefresh={() => void history.refresh()}
    />
  );
}
