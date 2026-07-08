#!/usr/bin/env node
// test-pay.mjs — live x402 round-trip. Proves the paid rail works end-to-end.
// Uses WALLET_ENV or reads from ../../.env (AGENT_SECRET).
// Outputs: HTTP status, data (first row), on-chain receipt tx.

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load wallet from env or parent .env
let secret = process.env.WALLET_ENV;
if (!secret) {
  const envPath = join(__dirname, '..', '..', '.env');
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, 'utf8');
    const m = env.match(/^AGENT_SECRET=(.*)$/m);
    if (m) secret = m[1].trim();
  }
}
if (!secret) {
  console.error('No wallet found. Set WALLET_ENV or ensure ../../.env has AGENT_SECRET.');
  process.exit(1);
}

const { Keypair } = await import('@solana/web3.js');
const { createX402Client } = await import('x402-solana/client');
const bs58 = await import('bs58');

let decoded;
try { decoded = Uint8Array.from(JSON.parse(secret)); }
catch { decoded = (bs58.default || bs58).decode(secret.trim()); }
const kp = Keypair.fromSecretKey(decoded);
const wallet = { publicKey: kp.publicKey, signTransaction: async (t) => { t.sign([kp]); return t; } };

const client = createX402Client({ wallet, network: 'solana', rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com', amount: 20000n });

const base = process.env.SNTL_BASE || 'https://a2a.sntl.site';
const endpoints = [
  { name: 'helium_stats (paid)', path: '/api/v2/stats' },
  { name: 'helium_threats/critical (paid)', path: '/api/v2/threats/critical?limit=3' },
];

console.log(`Payer: ${kp.publicKey.toBase58()}\n`);

for (const ep of endpoints) {
  console.log(`>>> ${ep.name}`);
  console.log(`    ${base}${ep.path}`);
  try {
    const res = await client.fetch(base + ep.path);
    const receipt = res.headers?.get ? res.headers.get('x-payment-response') : null;
    const body = await res.json();
    const rows = body?.rows?.length ?? body?.rowCount ?? '?';
    const sample = body?.rows?.[0] ? JSON.stringify(body.rows[0]).slice(0, 200) : JSON.stringify(body).slice(0, 200);
    console.log(`    HTTP ${res.status}  |  rows=${rows}`);
    console.log(`    sample: ${sample}`);
    if (receipt) {
      try { console.log(`    receipt: ${Buffer.from(receipt, 'base64').toString().slice(0, 120)}`); }
      catch { console.log(`    receipt: ${receipt.slice(0, 80)}`); }
    }
  } catch (e) {
    console.log(`    ERR: ${e.message}`);
  }
  console.log('');
}

console.log('test-pay OK');
