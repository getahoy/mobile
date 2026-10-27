const MS_PER_SECOND = 1000;

export const talkCopy = {
  holdToTalk: "Hold to talk",
  listening: (durationMs: number) =>
    `Listening… ${Math.floor(durationMs / MS_PER_SECOND)}s`,
  understanding: "Understanding…",
  heard: (text: string) => `Heard “${text}”`,
  sending: (mac: string) => `Sending to ${mac}…`,
  offline: "Speech needs the internet.",
  transcribeFailed: "Speech didn’t work this time.",
  nothingHeard: "Didn’t catch that.",
  macUnreachable: (mac: string) => `Can’t reach ${mac}.`,
  noAnswer: (mac: string) => `No answer from ${mac}.`,
  checkMac: "Check your Mac.",
  rateLimited: "Too many tries, wait a moment.",
  signedOut: "Sign in again.",
  tryAgain: "Try again",
  noMac: "Connect to your Mac to talk.",
  locked: (mac: string) => `${mac} is locked. Unlock it to use Ahoy.`,
  paused: (mac: string) => `${mac} is paused. Tap Connect to talk.`,
  micBlocked: "Ahoy needs the microphone to hear your command.",
  openSettings: "Open Settings",
  buttonLabel: (mac: string) => `Hold to talk to ${mac}`,
  buttonHint: "Hold, say a command, then let go to send it.",
};
