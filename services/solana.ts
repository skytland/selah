/**
 * Solana on-chain helpers — SELAH SPL Token-2022 minting.
 *
 * The mint authority keypair is loaded from the SELAH_MINT_KEYPAIR env var
 * (a JSON byte array). This keypair signs mint-to instructions server-side.
 * For the hackathon, this runs in the app itself; post-hackathon it should
 * move to a backend that verifies the transfer before minting.
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMintToInstruction,
  getOrCreateAssociatedTokenAccount,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SOLANA_RPC_ENDPOINT, SELAH_MINT_ADDRESS, COMMITMENT } from '../constants/solana';

/** Loads the mint authority keypair from the environment variable. */
function loadMintAuthority(): Keypair {
  const raw = process.env.SELAH_MINT_KEYPAIR;
  if (!raw) throw new Error('SELAH_MINT_KEYPAIR env variable is not set');
  try {
    const bytes = JSON.parse(raw) as number[];
    return Keypair.fromSecretKey(Uint8Array.from(bytes));
  } catch {
    throw new Error('Invalid SELAH_MINT_KEYPAIR format — expected JSON byte array');
  }
}

export interface MintResult {
  signature: string;
  newBalance: number;
}

/**
 * Mints 1 SELAH token to the user's wallet after verifying the SOL transfer.
 *
 * Flow:
 *  1. Verify transfer signature is confirmed on-chain
 *  2. Load mint authority
 *  3. Get or create user's associated token account
 *  4. Mint 1 token (0 decimals)
 *  5. Return new SELAH balance
 */
export async function mintSelah(
  userPublicKey: PublicKey,
  transferSignature: string,
): Promise<MintResult> {
  if (!SELAH_MINT_ADDRESS) {
    throw new Error(
      'EXPO_PUBLIC_SELAH_MINT_ADDRESS is not set. ' +
        'Deploy the mint first and add its address to .env.local.',
    );
  }

  const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);

  // 1. Verify transfer confirmed on-chain
  const status = await connection.getSignatureStatus(transferSignature, {
    searchTransactionHistory: true,
  });
  const confirmation = status.value?.confirmationStatus;
  if (confirmation !== 'confirmed' && confirmation !== 'finalized') {
    throw new Error(
      `Transfer not yet confirmed (status: ${confirmation ?? 'unknown'}). ` +
        'Please wait a moment and try again.',
    );
  }

  // 2. Load mint authority
  const mintAuthority = loadMintAuthority();
  const mintAddress = new PublicKey(SELAH_MINT_ADDRESS);

  // 3. Detect whether this is a Token-2022 or classic SPL mint
  let programId = TOKEN_PROGRAM_ID;
  try {
    const mintInfo = await getMint(connection, mintAddress, COMMITMENT, TOKEN_2022_PROGRAM_ID);
    if (mintInfo) programId = TOKEN_2022_PROGRAM_ID;
  } catch {
    // Falls back to classic SPL
  }

  // 4. Get or create user's associated token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,    // payer for account creation
    mintAddress,
    userPublicKey,
    false,
    COMMITMENT,
    undefined,
    programId,
  );

  // 5. Mint 1 SELAH (decimals = 0, so amount = 1)
  const mintTx = new Transaction().add(
    createMintToInstruction(
      mintAddress,
      tokenAccount.address,
      mintAuthority.publicKey,
      1,                // 1 whole token
      [],
      programId,
    ),
  );

  const mintSig = await sendAndConfirmTransaction(
    connection,
    mintTx,
    [mintAuthority],
    { commitment: COMMITMENT },
  );

  // 6. Return new balance (total days completed)
  const updatedAccount = await connection.getTokenAccountBalance(
    tokenAccount.address,
    COMMITMENT,
  );
  const newBalance = parseInt(updatedAccount.value.amount, 10);

  return { signature: mintSig, newBalance };
}

/** Reads the user's current SELAH balance (total completions). */
export async function getSelahBalance(userPublicKey: PublicKey): Promise<number> {
  if (!SELAH_MINT_ADDRESS) return 0;

  const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);
  const mintAddress = new PublicKey(SELAH_MINT_ADDRESS);

  try {
    // Try Token-2022 first, fall back to classic
    let programId = TOKEN_2022_PROGRAM_ID;
    let tokenAccounts = await connection.getTokenAccountsByOwner(userPublicKey, {
      mint: mintAddress,
    });
    if (tokenAccounts.value.length === 0) {
      programId = TOKEN_PROGRAM_ID;
      tokenAccounts = await connection.getTokenAccountsByOwner(userPublicKey, {
        mint: mintAddress,
      });
    }
    if (tokenAccounts.value.length === 0) return 0;

    const balance = await connection.getTokenAccountBalance(
      tokenAccounts.value[0].pubkey,
      COMMITMENT,
    );
    return parseInt(balance.value.amount, 10);
  } catch {
    return 0;
  }
}

/**
 * Deploys the SELAH SPL Token-2022 mint.
 * Run this once via: npx ts-node scripts/deploy-mint.ts
 * Returns the new mint address.
 */
export async function deploySelahMint(): Promise<string> {
  const { createMint } = await import('@solana/spl-token');
  const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);
  const mintAuthority = loadMintAuthority();

  const mintAddress = await createMint(
    connection,
    mintAuthority,            // payer
    mintAuthority.publicKey,  // mint authority
    null,                     // freeze authority (none)
    0,                        // decimals
    undefined,
    { commitment: COMMITMENT },
    TOKEN_2022_PROGRAM_ID,    // SPL Token-2022
  );

  return mintAddress.toBase58();
}
