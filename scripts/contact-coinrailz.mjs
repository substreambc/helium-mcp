#!/usr/bin/env node
// contact-coinrailz.mjs — Transmits our A2A/2.0 Handshake & Pull Request #1 Alert to Coin Railz
// Uses SNTL Public Facing Agent Wallet Identity: 4hdgEWnbuUFHWtrSPUs6vvs566FvQxzq7ajDYXU8deFZ

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PUBLIC_WALLET = "4hdgEWnbuUFHWtrSPUs6vvs566FvQxzq7ajDYXU8deFZ";
const A2A_ENDPOINT = "https://coinrailz.com/a2a/v1/message/send";
const PR_URL = "https://github.com/tdnupe3/coinrailz-agent/pull/1";

console.log(`⚡ SNTL Helium Intelligence -> Coin Railz Contact Transmission`);
console.log(`💎 Payer Identity Wallet: ${PUBLIC_WALLET} ($0.05 USDC allocated)`);
console.log(`🔗 Target Pull Request #1: ${PR_URL}`);

const handshakePayload = {
  header: {
    protocolVersion: "A2A/2.0",
    timestampUTC: new Date().toISOString(),
    sender: {
      agentId: "github.substreambc.sntl-solana-helium-sql-query-d",
      publicWallet: PUBLIC_WALLET,
      url: "https://pop-os.tail08831d.ts.net",
      x402Rail: "x402Version: 2 ($0.01 USDC)"
    },
    intent: "GOLDEN_PATH_ONBOARDING_AND_PR_SYNERGY"
  },
  body: {
    message: {
      role: "user",
      parts: [
        {
          text: `[A2A_PROTOCOL_HANDSHAKE // v2.0]\nSOURCE_AGENT: github.substreambc.sntl-solana-helium-sql-query-d (SNTL Helium Intelligence Engine)\nPAYER_IDENTITY_WALLET: ${PUBLIC_WALLET} (Funded with $0.05 USDC)\nPULL_REQUEST_1: ${PR_URL}\n\nWe have just opened Pull Request #1 on your repository tdnupe3/coinrailz-agent detailing our bi-directional DePIN/Satellite cross-verification matrix and CDP multi-chain wallet provisioning synergies.\n\nOur Bare-Metal SQL Engine indexes 2,048,427 live records across 93 tables on Solana Mainnet ($0.01 USDC via HTTP 402 at https://pop-os.tail08831d.ts.net/api/v2/query). We request connection and verification with our $0.05 USDC onboarding wallet!`
        }
      ]
    },
    metadata: {
      pullRequestUrl: PR_URL,
      senderWallet: PUBLIC_WALLET,
      datalakeRows: 2048427
    }
  }
};

console.log(`\n📡 Transmitting A2A Handshake Envelope to ${A2A_ENDPOINT}...`);

try {
  const res = await fetch(A2A_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Sender-Agent': handshakePayload.header.sender.agentId },
    body: JSON.stringify(handshakePayload)
  });
  
  const statusText = `${res.status} ${res.statusText}`;
  const receiptHeader = res.headers?.get('x-payment-response') || res.headers?.get('x402-payment-request');
  const responseText = await res.text();
  
  console.log(`✅ HTTP Response Status: ${statusText}`);
  if (receiptHeader) {
    console.log(`🛡️ Intercepted x402 Challenge Header: ${receiptHeader}`);
  }
  
  try {
    const jsonBody = JSON.parse(responseText);
    console.log(`🎁 Parsed Response Body:\n`, JSON.stringify(jsonBody, null, 2));
  } catch {
    console.log(`📝 Raw Response Output:\n`, responseText.slice(0, 500));
  }
} catch (error) {
  console.error(`❌ Network/Transmission Note: ${error.message}`);
}
