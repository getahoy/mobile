export const macCopy = {
  chip: {
    connected: "",
    connecting: "Connecting",
    locked: "Locked",
    paused: "Paused",
    off: "Off",
    notRunning: "Not running",
    asleep: "Asleep",
    cantReach: "Can’t reach",
    mobileData: "Mobile data",
    updateNeeded: "Update needed",
    notRecognised: "Not recognised",
  },
  talkTo: "Talk to",
  connectedWord: "Connected",
  connecting: "Connecting…",
  connected: "Connected · encrypted",
  locked: (mac: string) => `${mac} is locked. Unlock it to use Ahoy.`,
  paused: "Paused. Ahoy will not connect until you tap Connect.",
  macOff: (mac: string) =>
    `Ahoy is turned off on ${mac}. Turn it on from the menubar.`,
  macQuit: (mac: string) =>
    `Ahoy is not running on ${mac}. Open it on the Mac.`,
  macAsleep: (mac: string) => `${mac} is asleep.`,
  cellular: (mac: string) =>
    `You are on mobile data. Join the same Wi-Fi as ${mac}.`,
  notFound: (mac: string) =>
    `Cannot reach ${mac}. Check it is awake, Ahoy is running, and you are on the same Wi-Fi.`,
  macTooOld: "Update the Ahoy app on your Mac to connect.",
  macTooNew: "Update this app to connect to your Mac.",
  unrecognised: (mac: string) =>
    `${mac} does not recognise this phone. Ahoy may have been reinstalled there.`,
  connect: "Connect",
  disconnect: "Disconnect",
  retry: "Try again",
  pairAgain: "Pair again",
  removeMac: "Remove this Mac",
  moreOptions: (mac: string) => `More options for ${mac}`,
  cancel: "Cancel",
  ended: {
    removed: {
      title: "Disconnected from your Mac.",
      before: "",
      after: " removed this phone. Scan a new code to pair again.",
      short: (mac: string) => `${mac} disconnected this phone.`,
    },
    signed_out: {
      title: "Signed out on your Mac.",
      before: "You signed out of Ahoy on ",
      after: ", which also unpaired this phone. Scan a new code to pair again.",
      short: (mac: string) => `You signed out of Ahoy on ${mac}.`,
    },
    replaced: {
      title: "Your Mac paired another phone.",
      before: "",
      after:
        " is now paired with a different phone. Scan a new code to pair this one again.",
      short: (mac: string) => `${mac} is now paired with a different phone.`,
    },
  },
  endedWhen: {
    justNow: "Just now",
    minutes: (count: number) =>
      count === 1 ? "1 minute ago" : `${count} minutes ago`,
    hours: (count: number) =>
      count === 1 ? "1 hour ago" : `${count} hours ago`,
    whileClosed: (when: string) => `${when} · while Ahoy was closed`,
  },
  stillPairedBefore: "You’re still paired with ",
  stillPairedAfter: ".",
  endedScanBefore: "On ",
  endedScanAfter:
    ", open Ahoy from the menubar and scan the code it shows. Any other Mac works too.",
  dismiss: "Dismiss",
  removeTitle: (mac: string) => `Remove ${mac}?`,
  removeBody: (mac: string) =>
    `Ahoy on ${mac} will stop accepting this phone. To use it again, scan a new code on the Mac.`,
  removeConfirm: "Remove",
  pairAgainHint: (mac: string) =>
    `On ${mac}, open Ahoy. If it shows another phone, choose Pair a new phone.`,
  pairedWith: (mac: string) => `Paired with ${mac}`,
  signOutTitle: "Sign out?",
  signOutBody: (macs: string) =>
    `This phone will also be removed from ${macs}. You will need to scan a code to pair again.`,
  signOutOfflineBody: (macs: string) =>
    `You’re offline. ${macs} will keep trusting this phone until you remove it there. Sign out anyway?`,
  signOutConfirm: "Sign out",
};
