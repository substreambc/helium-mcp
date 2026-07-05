# @web3solutions33/helium-mcp

Machine-first MCP for the **SNTL Helium × Solana DePIN intelligence datalake** — threat & anomaly, geospatial, and forensic chronicles. Pay-per-call via **x402 on Solana**. First tier free. No signup, no key. **The protocol is the UI.**

![MIT](https://img.shields.io/badge/license-MIT-46C8A6) ![pay x402](https://img.shields.io/badge/pay-x402-E8B04B) ![Solana](https://img.shields.io/badge/Solana-mainnet-14F195)

> An open (MIT) reference implementation of an **x402-metered MCP tool** on Solana — reuse the pattern for your own agent commerce.

## Tools (10 — auto-generated from `src/registry.mjs`, the contract)
| tier | tools |
|------|-------|
| free | `helium_ledger` |
| $0.01 | `helium_stats` · `helium_query` · `helium_threats` · `helium_anomalies` · `helium_event` |
| $0.05 | `helium_chronicle` · `helium_escalation` · `helium_geo` · `helium_wallets` |

Paid calls return the settling **Solana transaction as an on-chain receipt** (`_receipt.x_payment_response`).

## Run (stdio)
```
npm i && node src/server.mjs
```

## Config (env only)
| var | default |
|-----|---------|
| `SNTL_BASE` | `https://a2a.sntl.site` |
| `WALLET_ENV` | — (BYO Solana key; paid tools only) |
| `RPC_URL` | mainnet-beta |
| `MAX_USDC_PER_CALL` | `1` (hard per-call spend cap) |

Paid tools settle x402 → PayAI facilitator → treasury. **We custody nothing** — the caller's wallet pays. Free tools need no wallet.

## The datalake — live snapshot · 2026-07-04
600K+ queryable on-chain events · **320K+ AI-classified** threat/anomaly · 240K+ space·time·power chronicles · 38K geolocated hotspots (H3) · 12 Helium program shards.

## Discovery
Agent card, AI manifest, and JWKS at `https://a2a.sntl.site/.well-known/` — the rail is **A2A + x402**, discoverable and verifiable by machines.

---
**Web3 Solutions, LLC** · [sntl.site](https://sntl.site)
