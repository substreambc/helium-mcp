<!-- ~/sentinel/opencode/dsv4/helium-mcp/README.md -->
# helium-mcp 

![MIT](https://img.shields.io/badge/license-MIT-46C8A6) ![pay x402](https://img.shields.io/badge/pay-x402-E8B04B) ![Solana](https://img.shields.io/badge/Solana-mainnet-14F195)

> An open (MIT) reference implementation of an **x402-metered MCP tool** on Solana — reuse the pattern for your own agent commerce.

Machine-first MCP for the **SNTL Helium × Solana DePIN intelligence datalake** — threat & anomaly, geospatial, and forensic chronicles. Pay-per-call via **x402 on Solana**. First tier free. No signup, no key. **The protocol is the UI.**

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
| `SNTL_BASE` | `https://pop-os.tail08831d.ts.net` |
| `WALLET_ENV` | — (BYO Solana key; paid tools only) |
| `RPC_URL` | `https://api.mainnet-beta.solana.com` |
| `MAX_USDC_PER_CALL` | `1` (hard per-call spend cap) |

Paid tools settle x402 → PayAI facilitator → treasury. **We custody nothing** — the caller's wallet pays. Free tools need no wallet.

## The datalake — live snapshot · 2026-07-04
2,048,427 verified live records · 93 public tables · 724,198 raw payloads · 483,140 AI-graded threat/anomaly events · 406,453 causal chains · 80,309 sentinel execution logs.

## Discovery
Agent card, AI manifest, and JWKS at `https://pop-os.tail08831d.ts.net/.well-known/` — the rail is **A2A + x402**, discoverable and verifiable by machines.

---
**Web3 Solutions, LLC** · [sntl.site](https://sntl.site)
