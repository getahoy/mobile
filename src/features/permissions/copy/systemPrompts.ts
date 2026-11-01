// app.config.ts imports this file, so it must not import anything.
export const systemPrompts = {
  camera: "Ahoy uses the camera only to scan the pairing code on your Mac.",
  mic: "Ahoy listens only while you hold the talk button.",
  net: "Ahoy connects to your Mac over your Wi‑Fi.",
} as const;
