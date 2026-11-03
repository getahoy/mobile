export function onceForLatestKey<T>(
  run: (key: string) => Promise<T>,
): (key: string) => Promise<T> {
  let latest: { key: string; running: Promise<T> } | null = null;
  return (key) => {
    if (latest?.key === key) return latest.running;
    const running = run(key).catch((error: unknown) => {
      if (latest?.running === running) latest = null;
      throw error;
    });
    latest = { key, running };
    return running;
  };
}
