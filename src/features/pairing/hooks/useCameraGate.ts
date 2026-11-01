import { useState } from "react";
import { usePermissionGate } from "@/features/permissions/hooks/usePermissionGate";
import { haptics } from "@/lib/haptics";

export function useCameraGate(resumed: boolean) {
  const [turnedOn, setTurnedOn] = useState(false);
  const gate = usePermissionGate("camera", {
    returnTo: "resumePairing",
    resumed,
    onGranted: (via) => {
      if (via !== "settings") return;
      haptics.success();
      setTurnedOn(true);
    },
  });
  return { gate, turnedOn, hideTurnedOn: () => setTurnedOn(false) };
}
