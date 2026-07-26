# SNTL DePIN Oracle MCP

> Model Context Protocol server for DePIN RF telemetry, spatial heuristics, and threat intelligence.

Reference implementation for **x402-metered MCP tools**: BYO wallet, strict per-record spend caps, and deterministic on-chain settlement per call.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/@web3solutions33/helium-mcp)](https://www.npmjs.com/package/@web3solutions33/helium-mcp)

---

## Table of Contents

- [Architecture](#architecture)
- [Quickstart](#quickstart)
- [Configuration](#configuration)
- [Tools Registry](#tools-registry)
- [Payment](#payment)
- [Data Substrate](#data-substrate)
- [Protocol Compliance](#protocol-compliance)
- [Network](#network)
- [License](#license)

---

## Architecture

```text
MCP Host (stdio) → server.mjs → registry.mjs → rail.mjs → SNTL Rail (pop-os.tail08831d.ts.net)
                                      ↓
                                x402-solana → Solana Mainnet (USDC)
```

**Stack:** Node.js ≥20, `@modelcontextprotocol/sdk@1.0.0`, `@solana/web3.js@1.95.0`, `x402-solana@2.0.4`, `zod@3.23.8`

---

## Quickstart

```bash
# Install globally
npm install -g @web3solutions33/helium-mcp

# Run (stdio)
npx -y @web3solutions33/helium-mcp
```

### Claude Desktop Configuration

Add the following to your Claude Desktop config:

```json
{
  "mcpServers": {
    "sntl-depin": {
      "command": "npx",
      "args": ["-y", "@web3solutions33/helium-mcp"]
    }
  }
}
```

---

## Configuration

| Env | Required | Default | Description |
|-----|----------|---------|-------------|
| `WALLET_ENV` | Paid tools only | — | Solana secret key (base58 or JSON byte-array). Free tools work without. |
| `SNTL_BASE` | No | `https://pop-os.tail08831d.ts.net` | Rail endpoint |
| `RPC_URL` | No | `https://api.mainnet-beta.solana.com` | Solana RPC |
| `MAX_USDC_PER_CALL` | No | `1.00` | Hard spend cap (atomic USDC). Must be ≥ 1.00 to access Tier 1 tools. |

---

## Tools Registry

Tools are auto-generated from a declarative config in `src/registry.mjs`.

> **Note:** All paid tools strictly enforce a `LIMIT 1` constraint at the database level to maintain the per-record economic model. Pagination parameters are intentionally omitted from tool schemas.

### 🔴 Tier 1 — Critical Intelligence & RF Physics (`$1.00`)

| Tool | Method | Path | Input Schema |
|------|--------|------|--------------|
| `rf_violations` | GET | `/api/v2/rf/violations` | `{}` |
| `phantom_devices` | GET | `/api/v2/rf/phantoms` | `{}` |
| `treasury_anomalies` | GET | `/api/v2/threats/treasury` | `{}` |
| `hivemapper_anomalies` | GET | `/api/v2/rf/hivemapper` | `{}` |
| `threats_critical` | GET | `/api/v2/threats/critical` | `{}` |

### 🟠 Tier 2 — High Threat & Forensic State (`$0.75`)

| Tool | Method | Path | Input Schema |
|------|--------|------|--------------|
| `threats_high` | GET | `/api/v2/threats/high` | `{}` |
| `chronicle` | GET | `/api/v2/chronicle` | `{}` |
| `geo_hotspots` | GET | `/api/v2/geo` | `{}` |

### 🟡 Tier 3 — Medium Threat & Wallet Intel (`$0.50`)

| Tool | Method | Path | Input Schema |
|------|--------|------|--------------|
| `threats_medium` | GET | `/api/v2/threats/medium` | `{}` |
| `wallet_intel` | GET | `/api/v2/wallets/{pool}` | `{pool: enum}` |
| `engagement_pyramid` | GET | `/api/v2/pyramid/{tier}` | `{tier: enum}` |

### 🔵 Tier 4 — Low Threat & Infrastructure (`$0.01`)

| Tool | Method | Path | Input Schema |
|------|--------|------|--------------|
| `query_datalake` | POST | `/api/v2/query` | `{sql: string}` (Must include `LIMIT 1`) |
| `threats_low` | GET | `/api/v2/threats/low` | `{}` |
| `anomalies` | GET | `/api/v2/anomalies` | `{}` |
| `lookup_event` | GET | `/api/v2/event/{signature}` | `{signature: string}` |

### 🆓 Free Tier (`$0.00`)

| Tool | Method | Path | Input Schema |
|------|--------|------|--------------|
| `stats` | GET | `/api/v2/stats` | `{}` |
| `ledger` | GET | `/api/v2/ledger/{wallet}` | `{wallet: string}` |

---

## Payment

### Flow

1. Agent calls a paid tool with `WALLET_ENV` set.
2. `rail.mjs` → `payClient()` initializes the `x402-solana` client.
3. Client signs the x402 payment request with the agent's wallet.
4. Rail validates payment via Solana Mainnet (Facilitator sponsors gas).
5. On success: returns data + receipt header.

### Receipt Format

```json
{
  "data": {
    "endpoint": "/api/v2/rf/violations",
    "dataType": "rf-telemetry",
    "rowCount": 1,
    "rows": [
      {
        "hotspot_address": "...",
        "rssi_delta_dbm": -42.5,
        "physics_violation": true
      }
    ]
  },
  "_receipt": {
    "payer": "AgentWalletAddress",
    "price_usdc": 1.00,
    "tier": "tier_1_critical",
    "x_payment_response": "base64-encoded Solana tx"
  }
}
```

---

## Data Substrate

Source: **SNTL DePIN Datalake** (Helium & Hivemapper)

| Dataset | Count |
|---------|-------|
| Raw ingested Solana transaction payloads | 724,198 |
| AI-graded DePIN threat/anomaly events | 483,140 |
| Forensic causal chains and state transition history | 406,453 |
| Physical DePIN node geospatial coordinates | 38,262 |

Additional data includes deterministic RF physics propagation telemetry (FSPL vs RSSI) and H3 geospatial indexing.

---

## Protocol Compliance

| Protocol | Version |
|----------|---------|
| MCP | 2026-07-28 RC (stateless schema) + stdio transport |
| x402 | Version 2 (Solana Mainnet, USDC) |

---

## Network

| Resource | Value |
|----------|-------|
| Rail | `https://pop-os.tail08831d.ts.net` |
| Treasury | `77jDxfGUbCUbJCRZfrmXcjQ2kT7MHe4oQ3ZUBzncBXCp` |
| RPC | Solana Mainnet (configurable via `RPC_URL`) |

---

## License

MIT — Copyright (c) 2026 Web3 Solutions, LLC
