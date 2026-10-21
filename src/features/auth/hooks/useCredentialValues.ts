import { useState } from "react";

export function useCredentialValues<FieldName extends string>() {
  const [values, setValues] = useState<Partial<Record<FieldName, string>>>({});

  const setField = (name: FieldName, text: string) =>
    setValues((current) => ({ ...current, [name]: text }));

  return { values, setField };
}
