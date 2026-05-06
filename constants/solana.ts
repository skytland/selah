import { clusterApiUrl } from '@solana/web3.js';

export const SOLANA_NETWORK =
  (process.env.EXPO_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') ??
  'devnet';

export const SOLANA_RPC_ENDPOINT =
  process.env.EXPO_PUBLIC_SOLANA_RPC ?? clusterApiUrl(SOLANA_NETWORK);

export const SELAH_MINT_ADDRESS =
  process.env.EXPO_PUBLIC_SELAH_MINT_ADDRESS ?? '';

// Selah MWA identity presented to the wallet app during authorization
export const MWA_IDENTITY = {
  name: 'Selah',
  uri: 'https://github.com/skytland/selah',
  icon: 'assets/icon.png',
} as const;

// Confirmation commitment level used throughout the app
export const COMMITMENT = 'confirmed' as const;
