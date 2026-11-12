import { historyCopy as baseHistoryCopy } from "@getahoy/lib";
import type { FailureReason } from "@getahoy/protocol";

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

export const historyCopy = {
  ...baseHistoryCopy,
  unnamedMac: "Mac",
  back: "Back",
  backToHistory: "History",
  allMacs: "All Macs",
  macCount: (count: number) => plural(count, "Mac", "Macs"),
  chooseMac: "Choose which Mac",
  showHistoryFor: "Show history for",
  notSynced: "Not synced yet",
  working: (mac: string) => `Working on ${mac}…`,
  offline: (waiting: number) =>
    waiting > 0
      ? `Offline · ${plural(waiting, "entry", "entries")} waiting to sync`
      : "Offline",
  emptyBody:
    "Everything you say to Ahoy, and what it did on your Mac, will be kept here.",
  offBody: "Ahoy isn’t keeping what you say. Turn it on to start again.",
  keepHistoryFooter: baseHistoryCopy.keepHistoryDisclosure(
    "You can clear it or turn it off here.",
  ),
  runAgain: (mac: string) => `Run again on ${mac}`,
  runAgainOff: "Run again needs a connection to your Mac.",
  viaRulesNote: "Matched one of Ahoy’s rules on your Mac. No AI was needed.",
  entryLabel: (heard: string, did: string, time: string) =>
    `${heard}. ${did}. ${time}`,
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
} as const;
