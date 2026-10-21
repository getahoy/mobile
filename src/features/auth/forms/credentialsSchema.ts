import {
  credentialsSchemas,
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
} from "@getahoy/lib";
import { authCopy } from "../copy/authCopy";

export const { signInSchema, signUpSchema } = credentialsSchemas({
  name: authCopy["validation.name"],
  email: authCopy["validation.email"],
  password: authCopy["validation.password"],
  passwordMinLength: authCopy["validation.passwordMinLength"].replace(
    "{minimum}",
    String(MINIMUM_PASSWORD_LENGTH),
  ),
  passwordMaxLength: authCopy["validation.passwordMaxLength"].replace(
    "{maximum}",
    String(MAXIMUM_PASSWORD_LENGTH),
  ),
});
