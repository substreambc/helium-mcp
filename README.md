# helium-mcp

[![MIT](https://img.shields.io/badge/license-MIT-46C8A6)](LICENSE)
[![x402](https://img.shields.io/badge/pay-x402-E8B04B)](https://x402.org)
[![Solana](https://img.shields.io/badge/Solana-mainnet-14F195)](https://solana.com)

**A reference implementation: drop this MCP into any host and charge per-call for your own data.**

---

## What this is

This is a **clean, minimal pattern** for building an MCP server that meters API calls via **x402 on Solana**. You plug in your data source, set your prices, and users pay you per-call with on-chain receipts.

**You control:**
- What data you serve
- What you charge per call
- Who pays (their wallet, not yours)

**We control:** Nothing. This is your code, your data, your money.

---

## The pattern in 3 files

| File | Purpose |
|------|---------|
| `src/registry.mjs` | **YOUR CONTRACT** — define your tools, prices, endpoints |
| `src/rail.mjs` | **YOUR RAIL** — fetch your data, paid or free |
| `src/server.mjs` | **THE FACE** — auto-generates MCP tools from your registry |

Edit `registry.mjs`. That's it. The rest is wiring.

---

## Quick start

```bash
npm i
node src/server.mjs
```

Your MCP server starts. Tools auto-generated from `registry.mjs`. Free tools work immediately. Paid tools require `WALLET_ENV` (the caller's wallet, not yours).

---

## Make it yours

### 1. Define your tools (registry.mjs)

```javascript
// Each entry = one MCP tool
export const TOOLS = [
  // Free: no payment required
  { name: 'my_free_tool',
    price: 0,
    method: 'GET',
    description: 'Free sample of your data',
    input: { param: z.string() },
    path: (a) => `/your-api/free/${a.param}` },

  // Paid: $0.01 per call
  { name: 'my_paid_tool',
    price: 0.01,
    method: 'POST',
    description: 'Your premium data',
    input: { query: z.string() },
    path: () => '/your-api/paid',
    body: (a) => ({ query: a.query }) },
];
```

**Rules:**
- `price: 0` = free, no wallet needed
- `price: >0` = paid, caller must set `WALLET_ENV`
- `path` = your endpoint (or any URL)
- `input` = Zod schema for validation

### 2. Wire your data source (rail.mjs)

```javascript
// Free calls: direct fetch
export async function callFree(tool, args) {
  const res = await fetch(YOUR_BASE_URL + tool.path(args));
  return { status: res.status, data: await res.json() };
}

// Paid calls: x402 fetch (caller pays)
export async function callPaid(tool, args) {
  const client = await payClient(); // uses caller's WALLET_ENV
  const res = await client.fetch(YOUR_BASE_URL + tool.path(args));
  const receipt = res.headers.get('x-payment-response');
  return { status: res.status, data: await res.json(), 
           payer: client.pub, receipt };
}
```

### 3. Configure (env only)

```bash
# Your rail base URL
SNTL_BASE=https://your-api.example.com

# Caller's wallet (required for paid tools)
# THEY set this, not you. You never see their key.
WALLET_ENV=

# Solana RPC (default is fine)
RPC_URL=https://api.mainnet-beta.solana.com

# Hard spend cap per call (YOU set this)
MAX_USDC_PER_CALL=1
```

---

## How the money flows

```
Caller's Agent → Your MCP Server → Your Data API
                  ↓
            x402 on Solana
                  ↓
Caller's Wallet → YOUR Treasury (USDC)
                  ↓
      On-chain receipt returned to caller
```

**Key points:**
- Caller's wallet pays **your treasury** directly
- You set the price per tool in `registry.mjs`
- You set the spend cap with `MAX_USDC_PER_CALL`
- Every paid call returns a Solana tx hash as receipt
- You custody nothing. The protocol handles payment.

---

## ON-CHAIN PROOF OF CONCEPT

**Wallet:** `DDxMHJceaNE9tWohpauakaek8Q7P7CJ2jkzhiHRybCmt`

**Sample transaction:** `4BUUzJ3keZ8Mkg97nm3HMHdwoiLfGDAJdK4AyqgnpBrsk1DgA8Rdg7q4JavaeYBZdQDoXktNc9Mk3Tj1NK3ZPKHt`

This wallet has executed **over 40 on-chain transactions** where **PayAI acts as the fee payer facilitator** for A2A payments. Each transaction represents a paying agent using this x402-metered MCP pattern.

**Verify on Solana Explorer:**
- [Main transaction](https://explorer.solana.com/tx/4BUUzJ3keZ8Mkg97nm3HMHdwoiLfGDAJdK4AyqgnpBrsk1DgA8Rdg7q4JavaeYBZdQDoXktNc9Mk3Tj1NK3ZPKHt)
- [Wallet activity](https://explorer.solana.com/address/DDxMHJceaNE9tWohpauakaek8Q7P7CJ2jkzhiHRybCmt)

---

## What the caller sees

### Free tools
```
Tool: my_free_tool
Input: { param: "test" }
Output: { data: {...} }
```

### Paid tools
```
Tool: my_paid_tool
Input: { query: "SELECT * FROM my_data" }
Output: {
  data: {...},
  _receipt: {
    payer: "CallerWalletAddress",
    price_usdc: 0.01,
    x_payment_response: "SolanaTxHash..."
  }
}
```

---

## Drop into any MCP host

### Claude Desktop
```json
{
  "mcpServers": {
    "your-server": {
      "command": "npx",
      "args": ["-y", "@your-scope/your-mcp"]
    }
  }
}
```

### Any stdio MCP host
```bash
npx @your-scope/your-mcp
```

---

## Real example: this repo's registry

```javascript
// 10 tools: 1 free, 5 at $0.01, 4 at $0.05
// All hitting https://pop-os.tail08831d.ts.net
// Replace with YOUR endpoints, YOUR prices

{ name: 'helium_ledger', price: 0, method: 'GET',
  description: 'FREE hook',
  input: { wallet: z.string() },
  path: (a) => `/api/v2/ledger/${a.wallet}` }

{ name: 'helium_query', price: 0.01, method: 'POST',
  description: 'Paid SQL query',
  input: { sql: z.string() },
  path: () => '/api/v2/query',
  body: (a) => ({ sql: a.sql }) }

{ name: 'helium_chronicle', price: 0.05, method: 'GET',
  description: 'Premium data',
  input: { limit: z.number().default(50) },
  path: (a) => `/api/v2/chronicle?limit=${a.limit}` }
```

**To make it yours:**
1. Change `name` to your tool names
2. Change `price` to your prices
3. Change `path` to your endpoints
4. Change `description` to your descriptions

---

## The x402 stack

| Layer | What it does | You provide |
|-------|--------------|-------------|
| MCP Server | Auto-generates tools | `registry.mjs` |
| x402 Client | Handles 402 payment | `WALLET_ENV` (caller) |
| PayAI | Routes payment | Nothing |
| Solana | Settles USDC | `RPC_URL` |

---

## Your checklist

- [ ] Fork this repo
- [ ] Edit `src/registry.mjs` with your tools
- [ ] Update `src/rail.mjs` to hit your API
- [ ] Set your treasury address in your rail
- [ ] Publish to npm: `npm publish`
- [ ] Tell users: `npx -y @your-scope/your-mcp`
- [ ] Collect USDC

---

## Files you care about

```
helium-mcp/
├── src/
│   ├── registry.mjs    # EDIT THIS: your tools, your prices
│   ├── rail.mjs        # EDIT THIS: your data fetching
│   ├── config.mjs      # EDIT IF: custom env vars
│   └── server.mjs      # DON'T TOUCH: MCP wiring
├── .env.example        # Template for users
├── mcp.json            # MCP manifest (auto-updates)
└── package.json        # npm config
```

---

## Ship 

1. **Define your tools** in `registry.mjs`
2. **Wire your data** in `rail.mjs`
3. **Ship it**

Users install with `npx -y @your-scope/your-mcp`, set `WALLET_ENV`, and pay you for your data.

---

**Pattern by [Web3 Solutions, LLC](https://sntl.site)** — Copy it. Use it. Profit.
