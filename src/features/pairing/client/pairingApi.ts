import {
  apiPaths,
  type PairingClaimRequest,
  type PairingUnlinkRequest,
  pairingClaimSchema,
  pairingLinksSchema,
  pairingUnlinkSchema,
} from "@getahoy/protocol";
import { sessionRequest } from "@/features/auth/client/sessionRequest";

export function claimPairing(body: PairingClaimRequest) {
  const path = apiPaths.pairingClaim;
  return sessionRequest({ path, body, schema: pairingClaimSchema });
}

export function unlinkPairing(body: PairingUnlinkRequest) {
  const path = apiPaths.pairingUnlink;
  return sessionRequest({ path, body, schema: pairingUnlinkSchema });
}

export function listPairingLinks(device: string) {
  const path = apiPaths.pairingLinks;
  const query = { device };
  return sessionRequest({ path, query, schema: pairingLinksSchema });
}
