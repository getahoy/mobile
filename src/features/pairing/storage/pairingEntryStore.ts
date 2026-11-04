type KeychainOptions = { keychainAccessible: number };

export type Keychain = {
  getItemAsync(key: string, options: KeychainOptions): Promise<string | null>;
  setItemAsync(
    key: string,
    text: string,
    options: KeychainOptions,
  ): Promise<void>;
  deleteItemAsync(key: string, options: KeychainOptions): Promise<void>;
};

type StoreParts = {
  keychain: Keychain;
  keychainAccessible: number;
  entries: readonly string[];
  migration: { done(): boolean; markDone(): void };
};

export function createPairingEntryStore({
  keychain,
  keychainAccessible,
  entries,
  migration,
}: StoreParts) {
  const options = { keychainAccessible };

  // A locked phone refuses Keychain reads; the entry keeps its old class until a later launch.
  async function rewrite(key: string): Promise<boolean> {
    try {
      const text = await keychain.getItemAsync(key, options);
      if (text !== null) await keychain.setItemAsync(key, text, options);
      return true;
    } catch {
      return false;
    }
  }

  async function migrate(): Promise<void> {
    if (migration.done()) return;
    const rewritten = await Promise.all(entries.map(rewrite));
    if (rewritten.every(Boolean)) migration.markDone();
  }

  // A rewrite racing a real write could put the old value back, so every call waits for it.
  const migrated = migrate();

  return {
    read: async (key: string) => {
      await migrated;
      return keychain.getItemAsync(key, options);
    },
    write: async (key: string, text: string) => {
      await migrated;
      await keychain.setItemAsync(key, text, options);
    },
    remove: async (key: string) => {
      await migrated;
      await keychain.deleteItemAsync(key, options);
    },
  };
}
