import type {
  FailureReason,
  HistoryFilter,
  HistoryPage,
  HistoryStatus,
} from "@getahoy/protocol";

type SummaryCounts = NonNullable<HistoryPage["summary"]>;

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

export const historyCopy = {
  unnamedMac: "Mac",
  title: "History",
  back: "Back",
  backToHistory: "History",
  allMacs: "All Macs",
  macCount: (count: number) => plural(count, "Mac", "Macs"),
  chooseMac: "Choose which Mac",
  showHistoryFor: "Show history for",
  summary: {
    all: ({ lastSevenDays, didntGoThrough }: SummaryCounts) =>
      didntGoThrough > 0
        ? `${lastSevenDays} in the last 7 days · ${didntGoThrough} didn’t go through`
        : `${lastSevenDays} in the last 7 days`,
    done: ({ wentThrough }: SummaryCounts) =>
      wentThrough === undefined
        ? null
        : `${wentThrough} went through in the last 7 days`,
    failed: ({ didntGoThrough }: SummaryCounts) =>
      `${didntGoThrough} didn’t go through in the last 7 days`,
  } satisfies Record<HistoryFilter, (counts: SummaryCounts) => string | null>,
  searchPlaceholder: "Search what you said",
  searchLabel: "Search history",
  clearSearch: "Clear search",
  filterLabel: "Filter",
  filters: { all: "All", done: "Done", failed: "Failed" },
  today: "Today",
  yesterday: "Yesterday",
  notSynced: "Not synced yet",
  working: (mac: string) => `Working on ${mac}…`,
  offline: (waiting: number) =>
    waiting > 0
      ? `Offline · ${plural(waiting, "entry", "entries")} waiting to sync`
      : "Offline",
  couldNotRefresh: "Couldn’t refresh",
  emptyTitle: "Nothing here yet.",
  emptyBody:
    "Everything you say to Ahoy, and what it did on your Mac, will be kept here.",
  loading: "Loading your history…",
  loadingSlow: "Still loading your history…",
  loadingSlowHint: "This can take a moment on a slow connection.",
  errorTitle: "Couldn’t load your history.",
  errorBody: "Your entries are safe. Check your connection and try again.",
  tryAgain: "Try again",
  clearedEyebrow: "Just now",
  clearedTitle: "History cleared.",
  clearedBody: "New commands will show up here.",
  noMatchTitle: (query: string) => `Nothing matches “${query}”.`,
  noMatchBody: "Search looks at what you said and what Ahoy did.",
  nothingFailedTitle: "Nothing failed.",
  nothingFailedBody: "Every command went through.",
  offTitle: "History is off.",
  offBody: "Ahoy isn’t keeping what you say. Turn it on to start again.",
  keepHistory: "Keep history",
  keepHistoryFooter:
    "Ahoy keeps a history of what you said and what it did in your account for 90 days. You can clear it or turn it off here. Speech audio is never stored.",
  clearHistory: "Clear history…",
  clearTitle: "Clear all history?",
  clearBody:
    "This deletes every entry, on your iPhone and on your Macs. It can’t be undone.",
  clearConfirm: "Clear history",
  cancel: "Cancel",
  couldNotClear: "Couldn’t clear your history. Try again.",
  status: {
    running: "Running",
    done: "Done",
    choice: "Asked you, then done",
    failed: "Didn’t work",
    blocked: "Blocked",
    cancelled: "Cancelled",
  } satisfies Record<HistoryStatus, string>,
  ahoyAsked: "Ahoy asked",
  youSaid: (seconds: string | null) =>
    seconds ? `You said · after ${seconds}s` : "You said",
  where: (app: string | null, seconds: string | null) =>
    [app ? `In ${app}` : null, seconds ? `${seconds}s` : null]
      .filter((part) => part !== null)
      .join(" · "),
  whyFailed: "Why it didn’t work",
  whyBlocked: "Why Ahoy stopped",
  whyCancelled: "What happened",
  timeWent: "Where the time went",
  hearing: "Hearing you",
  understanding: "Understanding",
  onMac: "On the Mac",
  waitedNote: (seconds: string) =>
    `The ${seconds}s Ahoy waited for your answer isn’t counted.`,
  understoodBy: "Understood by",
  viaAi: "Smart (AI)",
  viaAiNote: "Your words were sent to Ahoy’s AI to work out what you meant.",
  viaRules: "Built-in rules",
  viaRulesNote: "Matched one of Ahoy’s rules on your Mac. No AI was needed.",
  runAgain: (mac: string) => `Run again on ${mac}`,
  runAgainOff: "Run again needs a connection to your Mac.",
  confirmRunTitle: "Run this again?",
  confirmRunBody: (heard: string) =>
    `“${heard}” can close an app or open an email draft.`,
  confirmRun: "Run again",
  report: "Report a problem",
  reportBody: "This is exactly what will be sent. Nothing else is attached.",
  reportNote: "Add a note (optional)",
  reportSend: "Send report",
  reportSent: "Thanks. We’ll look at this one.",
  couldNotReport: "Couldn’t send the report. Try again.",
  reportFields: {
    heard: "What you said",
    did: "What Ahoy did",
    status: "Status",
    app: "App",
    reason: "Reason",
    timings: "Timings",
  },
  copy: "Copy",
  copied: "Copied",
  delete: "Delete",
  deleted: "Deleted",
  undo: "Undo",
  couldNotDelete: "Couldn’t delete that entry. Try again.",
  couldNotUndo: "Couldn’t undo",
  entryLabel: (heard: string, did: string, time: string) =>
    `${heard}. ${did}. ${time}`,
  copiedText: (heard: string, did: string | null) =>
    did ? `“${heard}” → ${did}` : `“${heard}”`,
  why: {
    macUnreachable:
      "Your iPhone couldn’t reach the Mac. Check that both are on the same Wi-Fi and Ahoy is open on the Mac.",
    noAnswer:
      "The Mac got the command but didn’t answer in time. Try it again in a moment.",
    nothingHeard:
      "Ahoy didn’t hear any words. Hold the button and speak again.",
    transcribeFailed:
      "Ahoy couldn’t turn what you said into words. Try again in a moment.",
    unknownApp:
      "Ahoy couldn’t find an app with that name on the Mac. Say the name as it appears in Applications.",
    nothingSelected:
      "Nothing was in front on the Mac, so Ahoy didn’t know where to act. Open the window, then say it again.",
    targetNotFound:
      "Ahoy couldn’t find that on the screen. Say the name as it’s written, or say a number on the overlay.",
    blockedApp:
      "This app is on the list of apps Ahoy never clicks or types in. You can change the list in Ahoy’s settings on the Mac.",
    screenChanged:
      "The screen changed before Ahoy acted, so it stopped. Say it again.",
    offline: "Your iPhone was offline. Connect to the internet and try again.",
    other: "Ahoy couldn’t do this one. Try saying it a different way.",
  } satisfies Record<FailureReason, string>,
  cancelledWhy:
    "Ahoy asked you something and the question closed before an answer, so nothing was changed.",
} as const;
