# Ahoy mobile

Expo app for iOS and Android: sign in, then talk to your Mac.

## Setup

```bash
pnpm install
cp .env.example .env.local
npx expo run:ios
```

`EXPO_PUBLIC_API_URL` points at the `web` server. `@getahoy/lib` comes from
`../shared/packages/lib`; run `pnpm build` there first.

This is a development build, not Expo Go. After adding a native module, run
`npx expo run:ios` again.

## Scripts

| Script | Does |
|---|---|
| `pnpm start` | Metro for the development build |
| `pnpm typecheck` | `tsc` |
| `pnpm lint` | `expo lint` |
