/**
 * generate-keypair.ts — Generates a new Solana keypair for the SELAH mint authority.
 *
 * Usage:
 *   npx ts-node scripts/generate-keypair.ts
 *
 * This prints the keypair as a JSON byte array suitable for SELAH_MINT_KEYPAIR,
 * and the public key for funding via airdrop.
 *
 * IMPORTANT: Save the secret key output securely. Never commit it to git.
 */

import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();

console.log('\n=== SELAH Mint Authority Keypair ===\n');
console.log('Public key (for airdrop funding):');
console.log(keypair.publicKey.toBase58());
console.log('\nSecret key (add to .env.local as SELAH_MINT_KEYPAIR):');
console.log(JSON.stringify(Array.from(keypair.secretKey)));
console.log('\n⚠️  Keep this secret key safe. Never commit it to git.');
console.log('    Store it in .env.local which is in .gitignore.\n');
