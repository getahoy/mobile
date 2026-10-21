import { authCopy } from "../copy/authCopy";

export const socialProviderCatalog = [
  { id: "google", label: authCopy["social.google"] },
] as const;

export type SocialProviderId = (typeof socialProviderCatalog)[number]["id"];
