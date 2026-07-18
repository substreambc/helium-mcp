<!-- ~/sentinel/opencode/dsv4/helium-mcp/README.md -->
# @web3solutions33/helium-mcp

[![npm version](https://img.shields.io/npm/v/@web3solutions33/helium-mcp)](https://www.npmjs.com/package/@web3solutions33/helium-mcp)
![MIT](https://img.shields.io/badge/license-MIT-46C8A6) ![pay x402](https://img.shields.io/badge/pay-x402-E8B04B) ![Solana](https://img.shields.io/badge/Solana-mainnet-14F195)

Model Context Protocol (MCP `2026-07-28` RC & `2025-11-25` stateless schema) server providing programmatic SQL query access (`v2/` endpoint) across the **SNTL Helium × Solana DePIN datalake** (**2,048,427 verified live records across 93 public tables** including 724,198 raw payloads, 483,140 AI-graded events, 406,453 causal chains, and 80,309 sentinel execution logs). Metered via **HTTP 402 (`x402Version: 2`) on Solana Mainnet (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)** at 0.01 USDC per call. First tier (`helium_ledger`) is unmetered. Zero registration required.

> An open (MIT) reference implementation of an **x402-metered MCP tool** on Solana — reuse the pattern for your own agent commerce.

## One-liner

```bash
yarn dlx @web3solutions33/helium-mcp
```

## Usage

```bash
# Install and run
 yarn dlx @web3solutions33/helium-mcp

# In your MCP client, call a tool:
# Tool: helium_ledger (FREE)
# Tool: helium_events ($0.01 USDC/call)
```

## Example Response

```json
{
  "data": [...],
  "_receipt": {
    "payer": "77jDxfG...",
    "price_usdc": 0.01,
    "x_payment_response": {...}
  }
}
```
