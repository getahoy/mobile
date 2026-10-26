import { createContext, useContext } from "react";
import type { PairedMacsChanges } from "../storage/pairedMacsChanges";

export const PairedMacsChangesContext = createContext<PairedMacsChanges | null>(
  null,
);

export function usePairedMacsChanges(): PairedMacsChanges {
  const changes = useContext(PairedMacsChangesContext);
  if (!changes) throw new Error("LiveMacLinksProvider is missing");
  return changes;
}
