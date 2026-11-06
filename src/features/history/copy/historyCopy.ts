import type { FailureReason, HistoryStatus } from "@getahoy/protocol";

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
  summary: (lastSevenDays: number, didntGoThrough: number) =>
    didntGoThrough > 0
      ? `${lastSevenDays} in the last 7 days · ${didntGoThrough} didn’t go through`
      : `${lastSevenDays} in the last 7 days`,
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
    "Ahoy keeps what you said and what it did for 90 days. Turning this off deletes it.",
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
  askedFirst: "Asked you first",
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
  copy: "Copy",
  copied: "Copied",
  delete: "Delete",
  deleted: "Deleted",
  undo: "Undo",
  couldNotDelete: "Couldn’t delete that entry. Try again.",
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
