import { type ReactNode, useState } from "react";
import { LiveMacLinks } from "../connection/liveMacLinks";
import { MacConnections } from "../connection/macConnections";
import { LiveMacLinksContext } from "../hooks/useLiveMacLinks";
import { MacConnectionsContext } from "../hooks/useMacConnections";
import { PairedMacsChangesContext } from "../hooks/usePairedMacsChanges";
import { PairedMacsChanges } from "../storage/pairedMacsChanges";

type LiveMacLinksProviderProps = { children: ReactNode };

export function LiveMacLinksProvider({ children }: LiveMacLinksProviderProps) {
  const [links] = useState(() => new LiveMacLinks());
  const [connections] = useState(() => new MacConnections(links));
  const [changes] = useState(() => new PairedMacsChanges());
  return (
    <LiveMacLinksContext.Provider value={links}>
      <MacConnectionsContext.Provider value={connections}>
        <PairedMacsChangesContext.Provider value={changes}>
          {children}
        </PairedMacsChangesContext.Provider>
      </MacConnectionsContext.Provider>
    </LiveMacLinksContext.Provider>
  );
}
