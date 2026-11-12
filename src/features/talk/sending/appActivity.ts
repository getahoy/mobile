export type AppActivity = {
  isActive: () => boolean;
  onChange: (listener: () => void) => () => void;
};

export function untilActive(activity: AppActivity): Promise<void> {
  if (activity.isActive()) return Promise.resolve();
  return new Promise((resolve) => {
    const stop = activity.onChange(() => {
      if (!activity.isActive()) return;
      stop();
      resolve();
    });
  });
}

export function watchLeaving(activity: AppActivity): () => boolean {
  let left = !activity.isActive();
  const stop = activity.onChange(() => {
    if (!activity.isActive()) left = true;
  });
  return () => {
    stop();
    return left;
  };
}
