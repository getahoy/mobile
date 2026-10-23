import type { FrameStream } from "./frameStream";

export class WebSocketFrameStream implements FrameStream {
  readonly #socket: WebSocket;

  constructor(socket: WebSocket) {
    this.#socket = socket;
    socket.binaryType = "arraybuffer";
  }

  send(frame: Uint8Array): void {
    this.#socket.send(frame);
  }

  close(): void {
    this.#socket.close();
  }

  onFrame(listener: (frame: Uint8Array) => void): void {
    this.#socket.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        listener(new Uint8Array(event.data));
      } else {
        this.close();
      }
    });
  }

  onClose(listener: () => void): void {
    this.#socket.addEventListener("close", listener);
  }
}
