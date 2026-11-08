import { useSyncExternalStore } from "react";
import { AccessibilityInfo } from "react-native";

const TOAST_MS = 3000;

export type ToastAction = { label: string; onAction: () => void };

export type ShownToast = {
  id: number;
  text: string;
  action: ToastAction | null;
};

const listeners = new Set<() => void>();
let shown: ShownToast | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let lastId = 0;

function publish(next: ShownToast | null) {
  shown = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function dismissToast() {
  if (timer) clearTimeout(timer);
  timer = null;
  publish(null);
}

// One toast at a time: a new one replaces the one showing and restarts the clock.
export function toast(text: string, action?: ToastAction) {
  if (timer) clearTimeout(timer);
  lastId += 1;
  publish({ id: lastId, text, action: action ?? null });
  timer = setTimeout(dismissToast, TOAST_MS);
  AccessibilityInfo.announceForAccessibility(text);
}

export function useShownToast() {
  return useSyncExternalStore(subscribe, () => shown);
}
