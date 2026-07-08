# SNTL Helium MCP — Agent Guide

This MCP server gives any AI agent **pay-per-call access** to the SNTL Helium/Solana DePIN threat & anomaly datalake. 285k AI-graded events, 233k causal chains, 12 program shards.

## Quick Install

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "sntl-helium": {
      "command": "npx",
      "args": ["-y", "@web3solutions33/helium-mcp"]
    }
  }
}
```

## Tools

| Tool | Price | What it does |
|------|-------|-------------|
| `helium_ledger` | FREE | Wallet's x402 payment + query history |
| `helium_stats` | $0.01 | Live event counts by threat tier |
| `helium_query` | $0.01 | SQL SELECT over 285k enriched events |
| `helium_threats` | $0.01 | Events at a threat tier (critical/high/medium/low/pending) |
| `helium_anomalies` | $0.01 | Highest anomaly-score events |
| `helium_event` | $0.01 | Single event by transaction_id |
| `helium_chronicle` | $0.05 | Causal chains — world-state reconstruction |
| `helium_escalation` | $0.05 | LLM verdict trail (SLM→LLM) |
| `helium_geo` | $0.05 | H3 geospatial hotspot resolution |
| `helium_wallets` | $0.05 | Scored wallet audience pools |

## Wallet

Free tools work without a wallet. Paid tools settle via **x402 on Solana** — your wallet pays USDC directly to the SNTL treasury. No signup, no API key.

Set `WALLET_ENV` to your Solana secret key (base58 or JSON byte-array).

## Examples

```
User: "Show me critical threats"
Agent: [calls helium_threats(tier: "critical", limit: 10)]

User: "What's the anomaly score on tx 5g3h5ttVtJQs8VBbeVDqdR8xvBobERBWqqmQhK9MJWfKyhtgzKndyfHdhovYSUtCGyVxSeV?"
Agent: [calls helium_event(transaction_id: "...")]

User: "Run SELECT count(*) FROM enriched_events_base WHERE threat_assessment = 'critical'"
Agent: [calls helium_query(sql: "...")]
```
