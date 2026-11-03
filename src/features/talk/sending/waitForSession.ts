export type SessionLink<S> = {
  current: () => S | null;
  onChange: (listener: () => void) => () => void;
};

export function waitForSession<S>(
  link: SessionLink<S>,
  timeoutMs: number,
): Promise<S | null> {
  const open = link.current();
  if (open) return Promise.resolve(open);
  return new Promise((resolve) => {
    const finish = (session: S | null) => {
      clearTimeout(timer);
      unsubscribe();
      resolve(session);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    const unsubscribe = link.onChange(() => {
      const session = link.current();
      if (session) finish(session);
    });
  });
}
