import { useState } from "react";
import type { ConfirmRequest } from "@/components/ui/confirmSheet";
import { macCopy } from "../copy/macCopy";
import { readPairedMacs } from "../storage/pairedMacs";
import { serverReachable, unpairEverything } from "../sync/linkSync";
import { useLiveMacLinks } from "./useLiveMacLinks";

async function signOutBody(): Promise<string | null> {
  const macs = (await readPairedMacs()).filter((mac) => !mac.ended);
  if (macs.length === 0) return null;
  const names = macs.map((mac) => mac.displayName).join(", ");
  const online = await serverReachable().catch(() => false);
  return online
    ? macCopy.signOutBody(names)
    : macCopy.signOutOfflineBody(names);
}

export function useConfirmSignOut() {
  const live = useLiveMacLinks();
  const [checking, setChecking] = useState(false);
  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirmSignOut = async (signOut: () => void): Promise<void> => {
    setChecking(true);
    const body = await signOutBody().catch(() => null);
    setChecking(false);
    const proceed = async () => {
      setRequest(null);
      await unpairEverything(live).catch(() => undefined);
      signOut();
    };
    if (body === null) return proceed();
    setRequest({
      title: macCopy.signOutTitle,
      body,
      confirmLabel: macCopy.signOutConfirm,
      cancelLabel: macCopy.cancel,
      onConfirm: () => void proceed(),
      onCancel: () => setRequest(null),
    });
  };
  return { checking, confirmSignOut, request };
}
