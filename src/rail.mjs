// rail.mjs — the x402 caller. Free tools fetch plain; paid tools settle via x402-solana + PayAI.
// BYO wallet (config.walletEnv). Spend-capped. Returns machine-legible receipts (tx via header).
import { config } from './config.mjs';

let _client = null;
async function payClient() {
  if (_client) return _client;
  const { Keypair } = await import('@solana/web3.js');
  const { createX402Client } = await import('x402-solana/client');
  const raw = config.walletEnv;
  if (!raw) throw new Error('WALLET_ENV not set — paid tools require a funded Solana wallet (BYO). Free tools work without it.');
  let secret;
  try { secret = Uint8Array.from(JSON.parse(raw)); }
  catch { secret = (await import('bs58')).default.decode(raw.trim()); }
  const kp = Keypair.fromSecretKey(secret);
  const wallet = {
    publicKey: { toString: () => kp.publicKey.toString() },
    address: kp.publicKey.toString(),
    signTransaction: async (t) => { t.sign([kp]); return t; },
  };
  const client = createX402Client({
    wallet, network: config.network, rpcUrl: config.rpcUrl,
    amount: BigInt(Math.round(config.maxUsdcPerCall * 1e6)), // hard spend cap (atomic USDC)
    verbose: false,
  });
  _client = { pub: kp.publicKey.toString(), client };
  return _client;
}

function reqOpts(tool, args) {
  return tool.method === 'POST'
    ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(tool.body ? tool.body(args) : {}) }
    : {};
}

export async function callFree(tool, args) {
  const res = await fetch(config.base + tool.path(args), reqOpts(tool, args));
  const data = await res.json().catch(() => ({ error: 'non-json response' }));
  return { status: res.status, data };
}

export async function callPaid(tool, args) {
  const { client, pub } = await payClient();
  const res = await client.fetch(config.base + tool.path(args), reqOpts(tool, args));
  const receipt = res.headers?.get ? res.headers.get('x-payment-response') : null;
  const data = await res.json().catch(() => ({ error: 'non-json response' }));
  return { status: res.status, data, payer: pub, receipt };
}
