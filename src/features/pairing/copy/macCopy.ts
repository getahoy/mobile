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
    removed: (mac: string) => `${mac} disconnected this phone.`,
    replaced: (mac: string) => `${mac} is now paired with a different phone.`,
    signed_out: (mac: string) => `You signed out of Ahoy on ${mac}.`,
  },
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
