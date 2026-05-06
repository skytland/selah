/**
 * Mobile Wallet Adapter — wraps @solana-mobile/mobile-wallet-adapter-protocol-web3js.
 * All private-key operations happen inside the user's wallet app.
 * Selah never holds or sees any private keys.
 */

import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SOLANA_RPC_ENDPOINT,
  SOLANA_NETWORK,
  MWA_IDENTITY,
  COMMITMENT,
} from '../constants/solana';

const WALLET_KEY = 'wallet:pubkey';
const AUTH_TOKEN_KEY = 'wallet:auth_token';

export interface WalletSession {
  publicKey: PublicKey;
  authToken: string;
}

/** Returns the stored wallet public key if the user has previously connected. */
export async function getStoredWallet(): Promise<PublicKey | null> {
  const pubkeyStr = await AsyncStorage.getItem(WALLET_KEY);
  if (!pubkeyStr) return null;
  try {
    return new PublicKey(pubkeyStr);
  } catch {
    return null;
  }
}

/** Authorizes the wallet via MWA and persists the session. */
export async function connectWallet(): Promise<WalletSession> {
  return transact(async (wallet: Web3MobileWallet) => {
    const authResult = await wallet.authorize({
      cluster: SOLANA_NETWORK as 'devnet' | 'mainnet-beta' | 'testnet',
      identity: MWA_IDENTITY,
    });

    const account = authResult.accounts[0];
    const publicKey = new PublicKey(account.address);
    const authToken = authResult.auth_token;

    await AsyncStorage.setItem(WALLET_KEY, publicKey.toBase58());
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);

    return { publicKey, authToken };
  });
}

/** Re-authorizes using a stored auth token (avoids prompting user again). */
export async function reconnectWallet(): Promise<WalletSession | null> {
  const storedAuthToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const storedPubkey = await AsyncStorage.getItem(WALLET_KEY);
  if (!storedAuthToken || !storedPubkey) return null;

  try {
    return await transact(async (wallet: Web3MobileWallet) => {
      const authResult = await wallet.reauthorize({
        auth_token: storedAuthToken,
        identity: MWA_IDENTITY,
      });
      const account = authResult.accounts[0];
      const publicKey = new PublicKey(account.address);

      await AsyncStorage.setItem(WALLET_KEY, publicKey.toBase58());
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authResult.auth_token);

      return { publicKey, authToken: authResult.auth_token };
    });
  } catch {
    return null;
  }
}

/** Deauthorizes the wallet and clears local session data. */
export async function disconnectWallet(): Promise<void> {
  const storedAuthToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (storedAuthToken) {
    try {
      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.deauthorize({ auth_token: storedAuthToken });
      });
    } catch {
      // Best-effort deauth
    }
  }
  await AsyncStorage.multiRemove([WALLET_KEY, AUTH_TOKEN_KEY]);
}

/**
 * Builds a SOL transfer transaction, sends it to the user's wallet for signing
 * via MWA, and returns the transaction signature.
 *
 * @param amountSOL        Amount to send (in SOL, e.g. 0.01)
 * @param recipientAddress Recipient's base58 public key string
 * @param senderPublicKey  Sender's PublicKey
 */
export async function signAndSendTransfer(
  amountSOL: number,
  recipientAddress: string,
  senderPublicKey: PublicKey,
): Promise<string> {
  const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(COMMITMENT);

  const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

  const tx = new Transaction({
    recentBlockhash: blockhash,
    feePayer: senderPublicKey,
  }).add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: new PublicKey(recipientAddress),
      lamports,
    }),
  );

  const storedAuthToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

  const [signature] = await transact(async (wallet: Web3MobileWallet) => {
    // Reauthorize to ensure session is live before presenting signing dialog
    if (storedAuthToken) {
      try {
        await wallet.reauthorize({
          auth_token: storedAuthToken,
          identity: MWA_IDENTITY,
        });
      } catch {
        await wallet.authorize({
          cluster: SOLANA_NETWORK as 'devnet' | 'mainnet-beta' | 'testnet',
          identity: MWA_IDENTITY,
        });
      }
    }

    return wallet.signAndSendTransactions({
      transactions: [tx],
    });
  });

  // Wait for confirmation
  await connection.confirmTransaction(
    { signature: signature as string, blockhash, lastValidBlockHeight },
    COMMITMENT,
  );

  return signature as string;
}

/** Returns the current SOL balance for a given public key. */
export async function getSolBalance(publicKey: PublicKey): Promise<number> {
  const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);
  const lamports = await connection.getBalance(publicKey, COMMITMENT);
  return lamports / LAMPORTS_PER_SOL;
}
