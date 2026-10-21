import { parseInput } from "@getahoy/lib";
import { useState } from "react";
import type { z } from "zod";
import { type AuthResponse, useAuthRequest } from "./useAuthRequest";

export function useCredentialsForm<Input extends Record<string, string>>(
  schema: z.ZodType<Input>,
  request: (input: Input) => Promise<AuthResponse>,
  onSuccess?: () => void,
) {
  const [values, setValues] = useState<Partial<Input>>({});
  const { pending, errorMessage, submit, showError } = useAuthRequest();

  const setField = (name: keyof Input, text: string) =>
    setValues((current) => ({ ...current, [name]: text }));

  const submitForm = () => {
    const form = parseInput(schema, values);
    if (form.outcome === "invalid") return showError(form.message);
    submit(() => request(form.input), onSuccess);
  };

  return { values, setField, pending, errorMessage, submit: submitForm };
}
