import { logger } from "@/features/logging/logger";
import type { PairedMac } from "../storage/pairedMacs";
import type { FrameStream, Transport } from "./frameStream";
import { WebSocketFrameStream } from "./webSocketFrameStream";

const DIAL_TIMEOUT_MS = 2500;

type DialMiss = "error" | "timeout";

// Measures whether a denied iOS Local Network fails faster than an absent Mac.
function logDialMiss(miss: DialMiss, startedAt: number): void {
  if (!__DEV__) return;
  logger.info("lanDial", `${miss} after ${Date.now() - startedAt} ms`);
}

function dialFirst(urls: string[]): Promise<WebSocket | null> {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const sockets = urls.map((url) => new WebSocket(url));
    let pending = sockets.length;
    let settled = false;
    const finish = (winner: WebSocket | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      for (const socket of sockets) if (socket !== winner) socket.close();
      resolve(winner);
    };
    const miss = (reason: DialMiss) => {
      if (!settled) logDialMiss(reason, startedAt);
      finish(null);
    };
    const timer = setTimeout(() => miss("timeout"), DIAL_TIMEOUT_MS);
    for (const socket of sockets) {
      socket.addEventListener("open", () => finish(socket));
      socket.addEventListener("error", () => {
        pending -= 1;
        if (pending === 0) miss("error");
      });
    }
  });
}

export const lanTransport: Transport = {
  kind: "lan",
  async open(mac: PairedMac): Promise<FrameStream | null> {
    if (mac.lanPort === null || mac.lastKnownAddresses.length === 0) {
      return null;
    }
    const port = mac.lanPort;
    const urls = mac.lastKnownAddresses.map((host) => `ws://${host}:${port}`);
    const socket = await dialFirst(urls);
    return socket ? new WebSocketFrameStream(socket) : null;
  },
};
