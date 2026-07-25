# SNTL Helium Intelligence MCP

**Model Context Protocol server for Helium/Solana DePIN threat & anomaly intelligence.** Reference implementation: x402-metered MCP tools, BYO wallet, hard per-call spend cap, on-chain receipt every call.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@web3solutions33/helium-mcp)](https://www.npmjs.com/package/@web3solutions33/helium-mcp)

---

## Architecture

```
MCP Host (stdio) → server.mjs → registry.mjs → rail.mjs → SNTL Rail (pop-os.tail08831d.ts.net)
                                      ↓
                                x402-solana → Solana Mainnet (USDC)
```

**Stack:** Node.js ≥20, `@modelcontextprotocol/sdk@1.0.0`, `@solana/web3.js@1.95.0`, `x402-solana@2.0.4`, `zod@3.23.8`

---

## Quickstart

```bash
# Install
npm install -g @web3solutions33/helium-mcp

# Run (stdio)
npx -y @web3solutions33/helium-mcp

# Claude Desktop
# {"mcpServers": {"sntl-helium": {"command": "npx", "args": ["-y", "@web3solutions33/helium-mcp"]}}}
```

---

## Configuration

| Env | Required | Default | Description |
|-----|----------|---------|-------------|
| `WALLET_ENV` | Paid tools only | - | Solana secret key (base58 or JSON byte-array). Free tools work without. |
| `SNTL_BASE` | No | `https://pop-os.tail08831d.ts.net` | Rail endpoint |
| `RPC_URL` | No | `https://api.mainnet-beta.solana.com` | Solana RPC |
| `MAX_USDC_PER_CALL` | No | `1` | Hard spend cap (atomic USDC) |

---

## Tools

### Registry (`src/registry.mjs`)

Auto-generates MCP tools from declarative config. No hand-wiring.

```javascript
// Tool definition structure
{
  name: string,           // MCP tool name
  price: number,          // USDC per call (0 = free)
  method: 'GET'|'POST',   // HTTP method
  description: string,    // Tool description + auto-appended price tag
  input: zod.Schema,       // Input validation
  path: (args) => string, // URL path
  body?: (args) => obj    // POST body (optional)
}
```

### Current Tools

| Tool | Price | Method | Path | Input |
|------|-------|--------|------|-------|
| `helium_ledger` | $0.00 | GET | `/api/v2/ledger/{wallet}` | `{wallet: string}` |
| `helium_stats` | $0.01 | GET | `/api/v2/stats` | `{}` |
| `helium_query` | $0.01 | POST | `/api/v2/query` | `{sql: string}` |
| `helium_threats` | $0.01 | GET | `/api/v2/threats/{tier}?limit={n}` | `{tier: enum, limit?: 1-1000}` |
| `helium_anomalies` | $0.01 | GET | `/api/v2/anomalies?limit={n}` | `{limit?: 1-1000}` |
| `helium_event` | $0.01 | GET | `/api/v2/event/{transaction_id}` | `{transaction_id: string}` |
| `helium_chronicle` | $0.05 | GET | `/api/v2/chronicle?limit={n}` | `{limit?: 1-1000}` |
| `helium_escalation` | $0.05 | GET | `/api/v2/escalation?limit={n}` | `{limit?: 1-1000}` |
| `helium_geo` | $0.05 | GET | `/api/v2/geo?limit={n}` | `{limit?: 1-1000}` |
| `helium_wallets` | $0.05 | GET | `/api/v2/wallets/{pool}?limit={n}` | `{pool: enum, limit?: 1-1000}` |

---

## Payment (x402)

### Flow

1. Agent calls paid tool with `WALLET_ENV` set
2. `rail.mjs` → `payClient()` initializes `x402-solana` client
3. Client signs x402 payment request with agent's wallet
4. Rail validates payment via Solana Mainnet
5. On success: returns data + receipt header

### Receipt Format

```json
{
  "data": {...},
  "_receipt": {
    "payer": "AgentWalletAddress",
    "price_usdc": 0.01,
    "x_payment_response": "base64-encoded Solana tx"
  }
}
```

### Free Tools

No wallet required. Returns `{data: ...}` only.

---

## Rail (`src/rail.mjs`)

Thin HTTP client wrapper. Two paths:

```javascript
// Free: direct fetch
callFree(tool, args) → {status, data}

// Paid: x402 fetch with payment
callPaid(tool, args) → {status, data, payer, receipt}
```

---

## Data

**Source:** SNTL Helium × Solana DePIN datalake
- **2,048,427 live rows** across **93 tables**
- **285k AI-graded Helium events** (SQL queryable)
- **233k causal chain rows** (forensic)
- **H3 geospatial indexing**
- **Threat tiers:** critical, high, medium, low, pending
- **Anomaly scoring** with LLM escalation trail

---

## Files

```
.
├── src/
│   ├── server.mjs      # MCP server (auto-registers tools from registry)
│   ├── registry.mjs    # Tool definitions (THE CONTRACT)
│   ├── rail.mjs        # x402 HTTP client
│   └── config.mjs      # Env-based config
├── mcp.json            # MCP server manifest
├── package.json        # npm package config
├── schema/
│   └── agent-card.json # Machine-readable agent card
└── .well-known/
    └── agent.json      # Well-known agent discovery
```

---

## Protocol Compliance

- **MCP:** 2026-07-28 RC (stateless schema) + 2025-11-25 (stdio)
- **x402:** Version 2 (Solana Mainnet, USDC)
- **Transport:** stdio

---

## Network

- **Rail:** `https://pop-os.tail08831d.ts.net`
- **Treasury:** `77jDxfGUbCUbJCRZfrmXcjQ2kT7MHe4oQ3ZUBzncBXCp`
- **RPC:** Solana Mainnet (configurable via `RPC_URL`)

---

## For DePIN Projects

Copy this pattern:

1. Fork repository
2. Edit `src/registry.mjs` (tools, prices, paths)
3. Update `src/rail.mjs` (your API endpoints)
4. Set treasury in config
5. `npm publish`

See [ECOSYSTEM.md](ECOSYSTEM.md) for adopters.

---

## License

MIT — Copyright (c) 2026 Web3 Solutions, LLC

---

**Pattern by [Web3 Solutions, LLC](https://sntl.site)** — Copy it. Use it. Profit.
