# @web3solutions33/helium-mcp

Machine-first MCP for the **SNTL Helium/Solana DePIN threat & anomaly datalake**.
Pay-per-call via **x402 on Solana**. First tier free. No signup, no key. The protocol is the UI.

## Tools (10 — auto-generated from `src/registry.mjs`, the contract)
| tier | tools |
|------|-------|
| free | `helium_ledger` |
| $0.01 | `helium_stats` `helium_query` `helium_threats` `helium_anomalies` `helium_event` |
| $0.05 | `helium_chronicle` `helium_escalation` `helium_geo` `helium_wallets` |

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
| `MAX_USDC_PER_CALL` | `1` |

Paid tools settle x402 → PayAI facilitator → treasury. **We custody nothing** — the caller's wallet pays.

## Data
600K+ on-chain events, 285k AI-graded · 233k causal chains · 12 Helium program shards · wallet/geo/LLM-verdict intel.
