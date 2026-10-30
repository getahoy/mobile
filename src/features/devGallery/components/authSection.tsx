import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import { CredentialsForm } from "@/features/auth/components/credentialsForm";
import { FormError } from "@/features/auth/components/formError";
import { SigningIn } from "@/features/auth/components/signingIn";
import { signInFields } from "@/features/auth/forms/credentialFields";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const noop = () => undefined;

export function AuthSection() {
  return (
    <GallerySection title={galleryCopy.auth}>
      <CredentialsForm
        fields={signInFields}
        values={{ email: galleryCopy.emailPlaceholder }}
        pending={false}
        errorMessage={authCopy["error.unauthorized"]}
        onChange={noop}
        onSubmit={noop}
      />
      <FormError message={authCopy["error.social"]} className="text-center" />
      <View className="h-120 overflow-hidden rounded-card border border-rope">
        <SigningIn slow={false} />
      </View>
      <View className="h-120 overflow-hidden rounded-card border border-rope">
        <SigningIn slow onCancel={noop} />
      </View>
    </GallerySection>
  );
}
