# SELAH

**Pause. Reflect. Give. Receive.**

> *One screen. One verse. One reflection. One gift. One token. Every day.*

[![React Native](https://img.shields.io/badge/React_Native-Expo_51-61DAFB?logo=react)](https://expo.dev)
[![Solana](https://img.shields.io/badge/Solana-Mobile_Wallet_Adapter-9945FF?logo=solana)](https://solanamobile.com)
[![Gloo AI](https://img.shields.io/badge/Gloo_AI-Completions_V2-4B6BFB)](https://docs.gloo.com)
[![YouVersion](https://img.shields.io/badge/YouVersion-Bible_API-FF6B35)](https://developers.youversion.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What It Does

Selah is the simplest on-chain daily devotional on Solana. Open the app, read today's Bible verse (YouVersion API), receive a 2-sentence reflection (Gloo API), give a small amount of SOL to a recipient wallet of your choice, and receive 1 SELAH token — a soul-bound, non-transferable SPL Token-2022 that is your permanent on-chain record of showing up. Give SOL. Receive SELAH. Every day.

---

## Demo

<a href="https://drive.google.com/file/d/1yLsK3jLz1-1TsQR-zuaJZvgjOiA_5BcG/view?usp=sharing">
  <img src="https://drive.google.com/thumbnail?id=1yLsK3jLz1-1TsQR-zuaJZvgjOiA_5BcG&sz=w800" alt="▶ Watch Selah Demo" width="640" />
</a>

> *Click the thumbnail above to watch the demo — recorded on a Solana Seeker device*

---

## Quick Start

```bash
git clone https://github.com/skytland/selah
cd selah
npm install
cp .env.example .env.local   # fill in your API keys (see below)

# Generate a mint authority keypair
npx ts-node scripts/generate-keypair.ts

# Fund it on devnet
solana airdrop 1 <YOUR_MINT_AUTHORITY_PUBKEY> --url devnet

# Deploy the SELAH SPL token mint
npx ts-node scripts/deploy-mint.ts
# → Copy the printed mint address into EXPO_PUBLIC_SELAH_MINT_ADDRESS in .env.local

# Run on connected Android device
npx expo run:android

# Build a distributable APK (requires EAS account)
eas build --platform android --profile preview
```

### Environment Variables

| Variable | Where to get it |
|---|---|
| `EXPO_PUBLIC_YVP_APP_KEY` | [platform.youversion.com](https://platform.youversion.com) — register, create an app, accept BSB license |
| `EXPO_PUBLIC_GLOO_CLIENT_ID` | [studio.ai.gloo.com](https://studio.ai.gloo.com) — create an API key |
| `EXPO_PUBLIC_GLOO_CLIENT_SECRET` | Same as above |
| `EXPO_PUBLIC_SELAH_MINT_ADDRESS` | Run `npx ts-node scripts/deploy-mint.ts` |
| `SELAH_MINT_KEYPAIR` | Run `npx ts-node scripts/generate-keypair.ts` |

---

## Hackathon Judging Criteria

| Criterion | How Selah Satisfies It |
|---|---|
| **Functional Android APK** | Single-screen React Native Expo app, tested on Seeker. Built with `eas build --platform android --profile preview`. |
| **Solana network integration** | Every completion triggers an on-chain SOL transfer + SPL Token-2022 mint. Both confirmed at `'confirmed'` commitment level before the flow advances. |
| **Mobile Wallet Adapter SDK** | All signing uses `@solana-mobile/mobile-wallet-adapter-protocol-web3js`. Selah never holds private keys. Seeker double-tap + biometric works natively. |
| **Open source on GitHub** | MIT license, public from day one at [github.com/skytland/selah](https://github.com/skytland/selah). |
| **Native mobile features** | `expo-haptics` confirmation, `expo-notifications` daily 7am verse reminder, AsyncStorage journal, Seeker biometric signing. |
| **dApp Store 2.0** | APK packaged per Solana dApp Store publishing spec and attached to the GitHub v1.0.0 release. |

---

## The SELAH Token

SELAH is an SPL Token-2022 that is **soul-bound by design**.

| Parameter | Value |
|---|---|
| Name | SELAH |
| Symbol | SELAH |
| Decimals | 0 (whole tokens only) |
| Supply | Uncapped — earned one per user per day |
| Transfer | Disabled at the app level (full Token-2022 `TransferHook` ships V1.1) |
| Mint authority | App-controlled keypair in `SELAH_MINT_KEYPAIR` |
| Earn condition | SOL transfer must confirm on-chain before mint fires |

You cannot buy SELAH. You cannot sell SELAH. You can only earn it by showing up — one day at a time. Your balance is your streak, permanently recorded on Solana.

**Mint address (devnet):** `EXPO_PUBLIC_SELAH_MINT_ADDRESS` (set after deploy)

---

## Architecture

```
selah/
  app.tsx                   # Root — single screen, no router
  components/
    VerseCard.tsx            # Date + verse reference + text
    Reflection.tsx           # Streaming Gloo AI response
    GiveButton.tsx           # SOL amount input + main CTA
    StreakBadge.tsx          # Streak counter + SELAH balance
    JournalList.tsx          # Last 7 completions
    SetupModal.tsx           # First-run onboarding
  services/
    youversion.ts            # YouVersion API + 24h cache
    gloo.ts                  # Gloo OAuth2 + SSE stream
    mwa.ts                   # Mobile Wallet Adapter wrapper
    solana.ts                # SELAH mint + balance helpers
  constants/
    verses.ts                # 365-day USFM verse schedule
    solana.ts                # RPC, mint address, network
  hooks/
    useDailyState.ts         # Daily loop state machine
    useStreak.ts             # Streak calculator
  scripts/
    generate-keypair.ts      # One-time mint authority keypair
    deploy-mint.ts           # One-time mint deployment
```

---

## The Daily Loop

1. App opens — today's verse loads instantly (cached for 24h)
2. A 2-sentence evangelical reflection streams in from Gloo AI
3. User taps **Give + Receive SELAH** — Mobile Wallet Adapter opens
4. User approves in wallet (Seeker: double-tap side button + fingerprint)
5. SOL transfer confirms on-chain
6. App mints 1 SELAH to the user's wallet
7. Haptic confirmation fires, streak increments
8. One-line journal entry saves locally: date, verse, amount given
9. Scroll down to see the last 7 entries

---

## License

MIT © 2026 Nick Skytland — [github.com/skytland/selah](https://github.com/skytland/selah)
