import { logger } from "@/features/logging/logger";
import type { PairedMac } from "../storage/pairedMacs";
import type { Dialed, Transport } from "./frameStream";
import { WebSocketFrameStream } from "./webSocketFrameStream";

const DIAL_TIMEOUT_MS = 2500;

type DialEnd = "open" | "error" | "timeout";

// Measures whether a denied iOS Local Network fails faster than an absent Mac,
// and whether a .local name that resolves to IPv6 first slows the connect.
function logDial(ip: string | null, end: DialEnd, startedAt: number): void {
  if (!__DEV__) return;
  const target = ip === null ? "bonjour" : "ip";
  logger.info("lanDial", `${target} ${end} after ${Date.now() - startedAt} ms`);
}

function dialOne(host: string, port: number, ip: string | null) {
  return new Promise<Dialed | null>((resolve) => {
    const startedAt = Date.now();
    const socket = new WebSocket(`ws://${host}:${port}`);
    let settled = false;
    const finish = (end: DialEnd) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      logDial(ip, end, startedAt);
      if (end === "open") {
        resolve({ stream: new WebSocketFrameStream(socket), ip });
        return;
      }
      socket.close();
      resolve(null);
    };
    const timer = setTimeout(() => finish("timeout"), DIAL_TIMEOUT_MS);
    socket.addEventListener("open", () => finish("open"));
    socket.addEventListener("error", () => finish("error"));
  });
}

export const lanTransport: Transport = {
  kind: "lan",
  dial(mac: PairedMac): Promise<Dialed | null>[] {
    const port = mac.lanPort;
    if (port === null) return [];
    const byIp = mac.lastKnownAddresses.map((ip) => dialOne(ip, port, ip));
    if (mac.localHost === null) return byIp;
    return [...byIp, dialOne(mac.localHost, port, null)];
  },
};
