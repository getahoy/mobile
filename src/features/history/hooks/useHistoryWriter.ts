import { addNetworkStateListener } from "expo-network";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import type { TalkState } from "@/features/talk/talkState";
import { historyCopy } from "../copy/historyCopy";
import { cancelRunning, putEntry } from "../historyOutbox";
import { freshTracking, trackTalk } from "../historyTracker";
import {
  keepsHistory,
  readOutbox,
  updateOutbox,
} from "../storage/historyStore";
import { flushHistory } from "../sync/flushHistory";

// A command still running when the app last died can never get its result now.
let finishedLastLaunch = false;

function finishLastLaunch(): void {
  if (finishedLastLaunch) return;
  finishedLastLaunch = true;
  updateOutbox((outbox) => cancelRunning(outbox, Date.now()));
}

function useFlushTriggers(): void {
  useEffect(() => {
    finishLastLaunch();
    void flushHistory();
    const foreground = AppState.addEventListener("change", (appState) => {
      if (appState === "active") void flushHistory();
    });
    const network = addNetworkStateListener((change) => {
      if (change.isConnected) void flushHistory();
    });
    return () => {
      foreground.remove();
      network.remove();
    };
  }, []);
}

export function useHistoryWriter(state: TalkState, mac: PairedMac): void {
  useFlushTriggers();
  const tracking = useRef(freshTracking);
  const previous = useRef(state);
  const name = mac.displayName.trim() || historyCopy.unnamedMac;
  const current = useRef({ key: mac.publicKey, name });

  useEffect(() => {
    current.current = { key: mac.publicKey, name };
  });

  useEffect(() => {
    const before = previous.current;
    previous.current = state;
    if (!keepsHistory()) return;
    const tracked = trackTalk({
      tracking: tracking.current,
      before,
      state,
      now: Date.now(),
      mac: current.current,
      outbox: readOutbox(),
    });
    tracking.current = tracked.tracking;
    if (tracked.writes.length === 0) return;
    updateOutbox((stored) => tracked.writes.reduce(putEntry, stored));
    void flushHistory();
  }, [state]);
}
