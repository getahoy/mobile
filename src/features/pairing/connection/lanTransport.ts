import type { PairedMac } from "../storage/pairedMacs";
import type { FrameStream, Transport } from "./frameStream";
import { WebSocketFrameStream } from "./webSocketFrameStream";

const DIAL_TIMEOUT_MS = 2500;

function dialFirst(urls: string[]): Promise<WebSocket | null> {
  return new Promise((resolve) => {
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
    const timer = setTimeout(() => finish(null), DIAL_TIMEOUT_MS);
    for (const socket of sockets) {
      socket.addEventListener("open", () => finish(socket));
      socket.addEventListener("error", () => {
        pending -= 1;
        if (pending === 0) finish(null);
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
