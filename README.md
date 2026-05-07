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

Selah is the first daily on-chain devo and generosity app built natively for the Solana dApp Store 2.0 and the Seeker device. Each day, the app surfaces a new Bible verse from the YouVersion Bible API and generates a 2-sentence reflection using Gloo AI's tradition-aware Completions V2 API. The user then can choose to donate a small amount of SOL to a church, charity or person of their choice using the Solana Mobile Wallet Adapter. After completing their devo, they are awarded 1 SELAH token minted to their wallet.

SELAH is a soul-bound SPL Token-2022. It cannot be bought, sold, or transferred. The only way to earn it is to show up each day. Your SELAH balance is a permanent, on-chain record of your faithfulness and generosity — visible in your wallet alongside your SOL.

The app solves a real problem: millions of Christians want to live generously but have no simple, spiritually grounded way to connect their crypto holdings to their faith and donate crypto easily through a trusted app. Selah closes that loop in one screen and under 30 seconds. It is the simplest possible app that is also genuinely novel — no other app on the Solana dApp Store exists like this that combines Scripture, AI, giving, and a daily streak token.

---

## How It Was Built

Selah is built with React Native (Expo SDK 51, bare workflow) and TypeScript.

**Solana:** `@solana-mobile/mobile-wallet-adapter-protocol-web3js` handles all wallet authorization and transaction signing — no private keys are stored in the app. Giving transactions use `@solana/web3.js` `SystemProgram.transfer`. On confirmation, the app mints 1 SELAH token using `@solana/spl-token` `createMintToInstruction` against a pre-deployed SPL Token-2022 mint. The soul-bound behavior is enforced via a TransferHook extension on the Token-2022 program.

**YouVersion Bible API:** Daily verse passages are fetched using the YouVersion REST API with a 365-day USFM schedule bundled in the app, cached in AsyncStorage with a 24-hour TTL.

**Gloo AI Completions V2:** We call the tradition-aware completions endpoint at `platform.ai.gloo.com/ai/v2/completions` with `auto_routing: true` and `tradition: 'evangelical'`. This is the only AI API in the world that supports theological tradition as a first-class parameter — it is what makes the reflection genuinely values-aligned rather than generic. Streaming is enabled for real-time UX. Authentication uses Gloo's OAuth2 client credentials flow.

**Seeker hardware:** The Seeker's native double-tap + fingerprint hardware gesture confirms transactions without leaving the app, making this a hardware-native experience unique to the Solana Mobile ecosystem.

---

## Demo

<a href="https://drive.google.com/file/d/1yLsK3jLz1-1TsQR-zuaJZvgjOiA_5BcG/view?usp=sharing">
  <img src="https://drive.google.com/thumbnail?id=1yLsK3jLz1-1TsQR-zuaJZvgjOiA_5BcG&sz=w800" alt="▶ Watch Selah Demo" width="640" />
</a>

> *Click the thumbnail above to watch the demo or [view the slides](https://www.canva.com/design/DAHI-DBlJLE/6DMSqBBDO-mQ63aEk4LGFQ/view)*

---

## Announcement

[![Tweet](https://img.shields.io/badge/View_on_X-%231DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/skytland/status/2052422530758262934)

> "Dusted off my coding skills at #EasyAConsensusHackathon this week and built Selah — an on-chain, AI-powered daily devotional. To use it is simple. Pause. Reflect. Give SOL. Receive a soul-bound SELAH token. Let me know what you think!"
>
> — [@skytland](https://x.com/skytland/status/2052422530758262934)

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
