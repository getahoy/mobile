import { type ReactNode, useState } from "react";
import { LiveMacLinks } from "../connection/liveMacLinks";
import { LiveMacLinksContext } from "../hooks/useLiveMacLinks";
import { PairedMacsChangesContext } from "../hooks/usePairedMacsChanges";
import { PairedMacsChanges } from "../storage/pairedMacsChanges";

type LiveMacLinksProviderProps = { children: ReactNode };

export function LiveMacLinksProvider({ children }: LiveMacLinksProviderProps) {
  const [links] = useState(() => new LiveMacLinks());
  const [changes] = useState(() => new PairedMacsChanges());
  return (
    <LiveMacLinksContext.Provider value={links}>
      <PairedMacsChangesContext.Provider value={changes}>
        {children}
      </PairedMacsChangesContext.Provider>
    </LiveMacLinksContext.Provider>
  );
}
