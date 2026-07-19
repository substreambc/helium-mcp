# SNTL Helium MCP

[![MIT License](https://img.shields.io/badge/license-MIT-46C8A6)](LICENSE)
[![x402 Metered](https://img.shields.io/badge/pay-x402-E8B04B)](https://x402.org)
[![Solana Mainnet](https://img.shields.io/badge/Solana-mainnet-14F195)](https://solana.com)
[![npm](https://img.shields.io/npm/v/@web3solutions33/helium-mcp)](https://www.npmjs.com/package/@web3solutions33/helium-mcp)

**An open-source, pay-per-call MCP server for the SNTL Helium × Solana DePIN intelligence datalake.**

---

## 🚀 What is SNTL Helium MCP?

SNTL Helium MCP is a **Model Context Protocol (MCP)** server that provides programmatic access to a comprehensive Helium/Solana DePIN threat and anomaly intelligence datalake. It's designed for AI agents, developers, and security researchers who need real-time access to:

- **2,048,427+ verified live records** across 93 public tables
- **483,140 AI-graded threat/anomaly events**
- **406,453 causal chains** for forensic analysis
- **724,198 raw payloads** from the Helium network
- **80,309 sentinel execution logs**

The server implements **x402 metering** on Solana Mainnet — you pay per API call with USDC, and receive an **on-chain transaction receipt** as proof of payment. No signup, no API keys, no custody.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🎯 Zero Friction** | No registration, no API keys. Just install and use. |
| **💰 Pay-Per-Call** | x402 metering with hard spend caps. You control the cost. |
| **📊 Real-Time Data** | Live snapshot of 2M+ verified DePIN records |
| **🔍 AI-Graded Intel** | Threat tiers, anomaly scores, causal chains |
| **🌍 Geospatial** | H3 resolution for hotspot analysis |
| **🔗 On-Chain Receipts** | Every paid call returns a Solana transaction hash |
| **📦 Open Source** | MIT licensed — reuse the pattern for your own commerce |

---

## 📦 Installation

### Quick Start (stdio)

```bash
# Install dependencies
npm install

# Run the server
node src/server.mjs
```

### Global Installation

```bash
npm install -g @web3solutions33/helium-mcp
sntl-helium-mcp
```

### Via npx (no local install)

```bash
npx @web3solutions33/helium-mcp
```

---

## 🛠️ Configuration

All configuration is environment-based. Create a `.env` file or export variables:

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `SNTL_BASE` | `https://pop-os.tail08831d.ts.net` | No | Base URL for the SNTL rail |
| `WALLET_ENV` | - | **Yes (paid tools)** | Your Solana secret key (base58 or JSON byte-array) |
| `RPC_URL` | `https://api.mainnet-beta.solana.com` | No | Solana RPC endpoint |
| `MAX_USDC_PER_CALL` | `1` | No | Hard spend cap per call (atomic guard) |

### Example `.env`

```bash
# Required only for paid tools
WALLET_ENV=your_base58_secret_key_here

# Optional overrides
SNTL_BASE=https://pop-os.tail08831d.ts.net
RPC_URL=https://api.mainnet-beta.solana.com
MAX_USDC_PER_CALL=1
```

> ⚠️ **Security Note**: Never commit your `WALLET_ENV` to version control. Use `.env` with `.gitignore`.

---

## 🎯 Available Tools

All tools are auto-generated from [`src/registry.mjs`](src/registry.mjs) — the single source of truth.

### 🆓 Free Tier (No Wallet Required)

| Tool | Description |
|------|-------------|
| `helium_ledger` | Get a wallet's x402 payment + query history against SNTL |

### 💵 Standard Tier ($0.01 USDC per call)

| Tool | Description | Parameters |
|------|-------------|------------|
| `helium_stats` | Live counts of enriched Helium/Solana DePIN events by threat tier | None |
| `helium_query` | Execute read-only SQL SELECT over 285k AI-graded events | `sql` (string) |
| `helium_threats` | Fetch enriched events at a specific threat tier | `tier` (enum), `limit` (1-1000) |
| `helium_anomalies` | Get highest anomaly-score enriched events | `limit` (1-1000) |
| `helium_event` | Fetch a single enriched event by transaction ID | `transaction_id` (string) |

**Threat Tiers**: `critical`, `high`, `medium`, `low`, `pending`

### 🏆 Premium Tier ($0.05 USDC per call)

| Tool | Description | Parameters |
|------|-------------|------------|
| `helium_chronicle` | Causal chains — world-state (time/space/power) reconstruction | `limit` (1-1000) |
| `helium_escalation` | Tiered LLM verdict trail (SLM 0.5B → SLM 3.5B → LLM) | `limit` (1-1000) |
| `helium_geo` | H3 geospatial hotspot resolution | `limit` (1-1000) |
| `helium_wallets` | Scored wallet audience pools | `pool` (enum), `limit` (1-1000) |

**Wallet Pools**: `target`, `hvt-anomaly`, `architects`, `paid`, `critical`, `pool`, `connected`, `blink-ready`

---

## 💳 Payment Flow (x402)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Your Agent │────▶│  MCP Server  │────▶│   SNTL Rail  │
└─────────────┘     └─────────────┘     └─────────────┘
         │                   │                   │
         │ 402 Payment       │ x402-solana      │
         │ Required          │ + PayAI           │
         ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Your Wallet │────▶│  Solana      │────▶│ SNTL Treasury│
│ (USDC)       │     │ Mainnet     │     │              │
└─────────────┘     └─────────────┘     └─────────────┘
         │
         └── On-chain transaction receipt returned as x_payment_response
```

**Key Points:**
- We **custody nothing** — your wallet pays directly
- Each paid call returns a Solana transaction hash as receipt
- Hard spend cap per call (default: 1 USDC)
- Free tools work without a wallet

---

## 📋 Usage Examples

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sntl-helium": {
      "command": "npx",
      "args": ["-y", "@web3solutions33/helium-mcp"],
      "env": {
        "WALLET_ENV": "your_secret_key_here"
      }
    }
  }
}
```

### Programmatic Usage

```javascript
// After starting the MCP server, call tools via the MCP client
const result = await mcpClient.callTool({
  name: "helium_threats",
  arguments: { tier: "critical", limit: 10 }
});

// Paid calls return:
// {
//   data: [...],
//   _receipt: {
//     payer: "YourWalletAddress",
//     price_usdc: 0.01,
//     x_payment_response: "SolanaTransactionHash"
//   }
// }
```

### SQL Query Example

```javascript
// Query the datalake directly
const result = await mcpClient.callTool({
  name: "helium_query",
  arguments: {
    sql: "SELECT * FROM enriched_events_base WHERE threat_assessment = 'critical' LIMIT 50"
  }
});
```

### Free Tool Example (No Wallet)

```javascript
// Check a wallet's history without payment
const result = await mcpClient.callTool({
  name: "helium_ledger",
  arguments: {
    wallet: "77jDxfGUbCUbJCRZfrmXcjQ2kT7MHe4oQ3ZUBzncBXCp"
  }
});
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MCP Server (server.mjs)                   │
├─────────────────────────────────────────────────────────────┤
│  • Auto-generates tools from registry.mjs                     │
│  • Routes free/paid calls appropriately                       │
│  • Returns JSON responses with optional receipts             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Rail Layer (rail.mjs)                     │
├─────────────────────────────────────────────────────────────┤
│  • callFree() - Direct HTTP to SNTL rail                       │
│  • callPaid() - x402-solana client + PayAI facilitator          │
│  • Manages wallet, signing, and transaction flow              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SNTL Rail (pop-os.tail08831d.ts.net)          │
├─────────────────────────────────────────────────────────────┤
│  • 93 public tables                                             │
│  • 2M+ verified live records                                    │
│  • REST API endpoints (/api/v2/*)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model

### Core Entities

| Entity | Count | Description |
|--------|-------|-------------|
| Verified Records | 2,048,427 | Live Helium/Solana DePIN data |
| Public Tables | 93 | Queryable datasets |
| Raw Payloads | 724,198 | Original network payloads |
| Threat/Anomaly Events | 483,140 | AI-graded security events |
| Causal Chains | 406,453 | Forensic reconstruction links |
| Sentinel Logs | 80,309 | Execution and audit trails |

### Key Tables (via helium_query)

- `enriched_events_base` - 285k AI-graded Helium events
- `chronicle` - 233k causal chain records
- `escalation` - LLM verdict trails
- `geo` - H3 geospatial data
- `wallets` - Scored audience pools

---

## 🔐 Security & Trust

### x402 Metering

- **Standard**: [x402 Version 2](https://x402.org) on Solana Mainnet
- **Implementation**: [x402-solana](https://github.com/substreambc/x402-solana) library
- **Facilitator**: PayAI for payment routing
- **Treasury**: `77jDxfGUbCUbJCRZfrmXcjQ2kT7MHe4oQ3ZUBzncBXCp`

### Guarantees

✅ **No Custody** - Your funds go directly to SNTL treasury  
✅ **Atomic Payments** - Each call is capped at `MAX_USDC_PER_CALL`  
✅ **On-Chain Proof** - Every paid call returns a Solana transaction hash  
✅ **Open Source** - Full transparency, MIT licensed  
✅ **Zero Registration** - No signup, no API keys, no tracking  

---

## 🚀 Integration Guide

### For MCP Hosts

The server supports **stdio transport** and follows both:
- MCP 2026-07-28 RC (stateless schema)
- MCP 2025-11-25 (stdio transport)

**Discovery Endpoints:**
- Agent Card: `https://pop-os.tail08831d.ts.net/.well-known/agent-card.json`
- Agent JSON: `https://pop-os.tail08831d.ts.net/.well-known/agent.json`
- JWKS: `https://pop-os.tail08831d.ts.net/.well-known/jwks.json`

### For Agent Developers

1. **Install** the MCP server in your agent's environment
2. **Configure** the `WALLET_ENV` with a funded Solana wallet
3. **Call** tools via the MCP client — free tools work immediately
4. **Pay** for premium tools automatically via x402

### For Security Researchers

- Use `helium_threats` to monitor critical/high threat events
- Use `helium_anomalies` to find unusual network activity
- Use `helium_chronicle` to trace causal chains across events
- Use `helium_query` to run custom SQL analysis

---

## 📈 Pricing Summary

| Tier | Price | Tools | Use Case |
|------|-------|-------|----------|
| Free | $0.00 | 1 tool | Wallet history lookup |
| Standard | $0.01 | 5 tools | Stats, queries, threats, anomalies, events |
| Premium | $0.05 | 4 tools | Causal chains, LLM verdicts, geospatial, wallets |

**Cost Control:**
- Set `MAX_USDC_PER_CALL` to limit exposure
- Default cap: 1 USDC per call
- All prices are hard-coded in [`src/registry.mjs`](src/registry.mjs)

---

## 🔧 Development

### Project Structure

```
helium-mcp/
├── src/
│   ├── server.mjs      # MCP server entry point
│   ├── rail.mjs        # x402 payment & rail calling
│   ├── config.mjs      # Environment configuration
│   └── registry.mjs    # Tool definitions (THE CONTRACT)
├── .well-known/
│   └── agent.json      # Agent metadata for discovery
├── schema/
│   └── agent-card.json # Agent card specification
├── docs/
│   └── AGENTS.md       # Agent integration guide
├── mcp.json            # MCP server manifest
├── package.json
└── README.md
```

### Adding New Tools

1. Edit [`src/registry.mjs`](src/registry.mjs)
2. Add a new entry to the `TOOLS` array:

```javascript
{
  name: 'helium_new_tool',
  price: 0.01,           // or 0 for free
  method: 'GET',         // or 'POST'
  description: 'What this tool does',
  input: { /* Zod schema */ },
  path: (args) => `/api/v2/new-endpoint`,
  body: (args) => ({ /* POST body */ })  // optional for POST
}
```

3. The server auto-generates MCP tools on startup

### Running Tests

```bash
# Check the project
npm test

# Lint
npm run lint
```

---

## 📚 Related Resources

- **[SNTL Website](https://sntl.site)** - Web3 Solutions, LLC
- **[x402 Specification](https://x402.org)** - Pay-per-call standard
- **[x402-solana](https://github.com/substreambc/x402-solana)** - Solana x402 implementation
- **[MCP SDK](https://github.com/modelcontextprotocol/sdk)** - Model Context Protocol
- **[Helium Network](https://helium.com)** - The People's Network
- **[Solana](https://solana.com)** - High-performance blockchain

### Related Agents

- **[SNTL Real-time Helium & Geo-spatial Intelligence](https://github.com/substreambc/my-agent)** - A2A agent card for the same datalake, 26 skills, x402-metered

---

## 📄 License

[MIT License](LICENSE) - Copyright (c) 2026 Web3 Solutions, LLC

---

## 🙏 Acknowledgments

- **Model Context Protocol** - For the MCP standard
- **Helium Foundation** - For the DePIN network
- **Solana Foundation** - For the blockchain infrastructure
- **All Contributors** - For building the open DePIN intelligence ecosystem

---

**Built by [Web3 Solutions, LLC](https://sntl.site)**  
*Open source. Pay-per-call. No custody. The protocol is the UI.*
