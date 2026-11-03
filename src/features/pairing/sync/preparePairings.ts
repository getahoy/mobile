import { onceForLatestKey } from "@/lib/onceForLatestKey";
import { claimPairingsFor } from "../storage/pairingOwner";

// Only the account check runs before the Mac list resolves, so dialling starts at once;
// useLinkSync settles revoked Macs alongside and reloads the list.
export const preparePairingsFor = onceForLatestKey(claimPairingsFor);
