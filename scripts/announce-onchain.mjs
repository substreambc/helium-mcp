#!/usr/bin/env node
// announce-onchain.mjs — posts a memo tx on Solana announcing the MCP launch.
// Proves the package is live by anchoring its version + timestamp on-chain.
// Usage: node scripts/announce-onchain.mjs

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');

// Load wallet
let secret = process.env.WALLET_ENV;
if (!secret) {
  const envPath = join(REPO, '..', '..', '.env');
  if (existsSync(envPath)) {
    const m = readFileSync(envPath, 'utf8').match(/^AGENT_SECRET=(.*)$/m);
    if (m) secret = m[1].trim();
  }
}
if (!secret) { console.error('No wallet found'); process.exit(1); }

const { Connection, Keypair, Transaction, TransactionInstruction, PublicKey } = await import('@solana/web3.js');
const bs58 = await import('bs58');

let decoded;
try { decoded = Uint8Array.from(JSON.parse(secret)); }
catch { decoded = (bs58.default || bs58).decode(secret.trim()); }
const kp = Keypair.fromSecretKey(decoded);

const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8'));
const conn = new Connection(process.env.RPC_URL || 'https://api.mainnet-beta.solana.com');
const MEMO = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const msg = `helium-mcp v${pkg.version} published ${new Date().toISOString()} — @web3solutions33/helium-mcp`;

const ix = new TransactionInstruction({ keys: [], programId: MEMO, data: Buffer.from(msg, 'utf8') });
const tx = new Transaction().add(ix);
const sig = await conn.sendTransaction(tx, [kp]);
await conn.confirmTransaction(sig, 'confirmed');

console.log(`Anchored on-chain: ${sig}`);
console.log(`Message: ${msg}`);
console.log(`View: https://solscan.io/tx/${sig}`);
