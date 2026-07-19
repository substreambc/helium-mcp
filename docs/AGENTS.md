# Agent Integration Guide

**How agents use your x402-metered MCP server to pay for your data.**

---

## Quick Install

### Claude Desktop
```json
// claude_desktop_config.json
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
npx -y @your-scope/your-mcp
```

---

## How agents call your tools

### Free tools (no wallet required)
```
Agent calls: your_free_tool(param: "value")
Returns: { data: {...} }
```

### Paid tools (caller pays you)
```
Agent calls: your_paid_tool(query: "SELECT * FROM my_data")
Returns: {
  data: {...},
  _receipt: {
    payer: "AgentWalletAddress",
    price_usdc: 0.01,
    x_payment_response: "SolanaTxHash..."
  }
}
```

---

## What the agent needs to set

```bash
# Required for paid tools only
WALLET_ENV=their_solana_secret_key

# Optional overrides
SNTL_BASE=https://your-api.example.com
RPC_URL=https://api.mainnet-beta.solana.com
MAX_USDC_PER_CALL=1
```

**Note:** Agents set `WALLET_ENV` with **their own** funded Solana wallet. You never see their key. They pay your treasury directly via x402.

---

## Example conversation flow

```
User: "Give me the latest data"
Agent: [calls your_paid_tool(query: "latest")]
      [x402 triggers: agent's wallet pays YOUR treasury]
      [returns data + on-chain receipt]
Agent: "Here's your data. Transaction proof: SolanaTxHash..."

User: "Show me free sample"
Agent: [calls your_free_tool(param: "sample")]
      [returns data immediately, no payment]
Agent: "Here's a free sample"
```

---

## For agent developers

1. **Install** the MCP server in your agent's environment
2. **Configure** `WALLET_ENV` with a funded Solana wallet (USDC)
3. **Call** tools via the MCP client
4. **Receive** on-chain receipts for every paid call

**That's it.** No API keys. No signup. No custody.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Paid tool fails with "WALLET_ENV not set" | Agent needs to set their Solana secret key |
| Paid tool fails with "insufficient funds" | Agent needs USDC in their wallet |
| Free tool returns 404 | Check your `SNTL_BASE` URL in config |
| Tool not found | Verify tool name in your `registry.mjs` |

---

**Pattern by [Web3 Solutions, LLC](https://sntl.site)** — Copy it. Use it. Profit.
