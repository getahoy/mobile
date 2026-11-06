import {
  type PairingClaimRequest,
  type PairingUnlinkRequest,
  pairingClaimSchema,
  pairingLinksSchema,
  pairingUnlinkSchema,
} from "@getahoy/protocol";
import { sessionRequest } from "@/features/auth/client/sessionRequest";

export function claimPairing(body: PairingClaimRequest) {
  const path = "/api/pairing/claim";
  return sessionRequest({ path, body, schema: pairingClaimSchema });
}

export function unlinkPairing(body: PairingUnlinkRequest) {
  const path = "/api/pairing/unlink";
  return sessionRequest({ path, body, schema: pairingUnlinkSchema });
}

export function listPairingLinks(device: string) {
  const path = "/api/pairing/links";
  const query = { device };
  return sessionRequest({ path, query, schema: pairingLinksSchema });
}
