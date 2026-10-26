export class PairedMacsChanges {
  readonly #listeners = new Set<() => void>();

  onChange(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  announce(): void {
    for (const listener of this.#listeners) listener();
  }
}
