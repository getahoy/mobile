import type { PairedMac } from "../storage/pairedMacs";

export interface FrameStream {
  send(frame: Uint8Array): void;
  close(): void;
  onFrame(listener: (frame: Uint8Array) => void): void;
  onClose(listener: () => void): void;
}

export type Dialed = { stream: FrameStream; ip: string | null };

export interface Transport {
  readonly kind: "lan";
  dial(mac: PairedMac): Promise<Dialed | null>[];
}
