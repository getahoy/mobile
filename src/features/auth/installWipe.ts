type InstallWipeSteps = {
  seen: () => boolean;
  wipe: () => Promise<void>;
  markSeen: () => void;
};

// The flag is set even when the wipe fails, so a broken wipe cannot sign the
// user out again on every launch.
export async function runInstallWipe(steps: InstallWipeSteps): Promise<void> {
  if (steps.seen()) return;
  try {
    await steps.wipe();
  } finally {
    steps.markSeen();
  }
}
