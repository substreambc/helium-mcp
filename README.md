![alt text](https://img.shields.io/badge/license-MIT-46C8A6)

![alt text](https://img.shields.io/badge/pay-x402-E8B04B)

![alt text](https://img.shields.io/badge/Solana-mainnet-14F195)
The fastest path from data to on-chain revenue. A production-grade framework for building an autonomous, machine-payable data business on Solana.
The Serverless Solana A2A Pattern
This is an open-source framework for monetizing your data on Solana. If you have a valuable API, this pattern allows you to start collecting on-chain USDC payments per query in under an hour, with no signups, no API keys, and no backend complexity.
It is the definitive pattern for building a modern Data-as-a-Service (DAAS) business in Web3. This repository is the open-source foundation for the SNTL DePIN Integrity Oracle, a production-grade Trust-as-a-Service API that uses this exact architecture to solve the multi-million dollar Sybil problem for networks like Helium.
Features
Pay-per-query: On-chain USDC payments via the elegant x402 protocol.
Serverless & Infinitely Scalable: Deploy globally on Cloudflare. No databases or servers to manage.
Machine-Readable by Design: Auto-generates agent-card.json and other manifests for discovery by autonomous agents.
Teaches Best Practices: Demonstrates value-based pricing and real-time streaming capabilities for building a sustainable data business.
Why This Matters: The Multi-Million Dollar Sybil Problem
DePIN networks like Helium rely on a physical ground truth: that their hardware is where its operator claims it is. "Sybil attacks," where fraudulent operators cluster hardware in one location while asserting it across a wide area, undermine the economic and physical integrity of the entire network. This erodes trust and costs honest participants millions in lost rewards.
The SNTL v4 engine was built to solve this. By fusing a network's on-chain data with independent, real-world data from other protocols (like Hivemapper), we can now prove reality. This MCP pattern is the tool we use to sell that truth.
The Architectural Pattern
code
Mermaid
graph TD
    subgraph "Your Business"
        A[Data Source / API]
        B(registry.mjs - Your Logic)
        C(rail.mjs - Your Data Fetching)
    end

    subgraph "MCP Framework (This Repo)"
        D{server.mjs - The Engine}
    end

    subgraph "The World"
        E[Autonomous Agent]
        F[Human User]
    end

    A --> C --> D
    B --> D
    E --> D
    F --> D

    style A fill:#2A3B47,stroke:#3498DB,stroke-width:2px
    style B fill:#34495E,stroke:#3498DB,stroke-width:2px
    style C fill:#34495E,stroke:#3498DB,stroke-width:2px
The pattern in 3 files
File	Purpose
src/registry.mjs	YOUR BUSINESS LOGIC — define your data products, pricing tiers, and endpoints
src/rail.mjs	YOUR DATA RAIL — fetch your data and set your treasury address
src/server.mjs	THE ENGINE — auto-generates your live A2A marketplace from your registry
Edit registry.mjs. That's it. The rest is wiring.
Quick start
code
Bash
npm i
node src/server.mjs```
Your MCP server starts. Your products are live, auto-generated from `registry.mjs`. Free products work immediately. Paid products require the caller to set `WALLET_ENV`.

---

## Make it yours

### 1. Define your products (registry.mjs)

This is where you define what you sell. Structure your offerings in tiers based on value.

```javascript
// Each entry = one product available on your A2A rail
export const TOOLS = [
  //  бесплатный: Onboarding & Transparency ($0)
  { name: 'my_free_tool',
    price: 0,
    method: 'GET',
    description: 'A free sample to prove your value.',
    input: { param: z.string() },
    path: (a) => `/your-api/free/${a.param}` },

  // COMMODITY: Core Data ($0.01)
  { name: 'my_paid_tool',
    price: 0.01,
    method: 'POST',
    description: 'Your core, high-volume data product.',
    input: { query: z.string() },
    path: () => '/your-api/paid',
    body: (a) => ({ query: a.query }) },
    
  // ALPHA: Premium Insight ($100.00)
  { name: 'my_alpha_tool',
    price: 100.00,
    method: 'GET',
    description: 'Your unique, high-value intelligence that solves a major problem.',
    input: { id: z.string() },
    path: (a) => `/your-api/alpha/${a.id}` }
];
Rules:
price: 0 = free, no wallet needed. Your hook.
price: >0 = paid, caller must set WALLET_ENV. Your business.
input = Zod schema for instant, automatic validation.
2. Wire your data source (rail.mjs)
(Instructions preserved as you wrote them)
3. Configure (env only)
(Instructions preserved as you wrote them)
How the money flows
This architecture ensures you custody nothing. The x402 protocol facilitates a direct, peer-to-peer payment from the caller's wallet to your treasury for every call.
code
Mermaid
sequenceDiagram
    participant User as User's Agent
    participant MCP as Your MCP Server
    participant Data as Your Data API
    participant Solana as Solana Mainnet
    participant Treasury as Your Treasury

    User->>MCP: Request for paid data
    MCP-->>User: 402 Payment Required challenge
    User->>Solana: Signs transaction to pay Treasury
    Solana-->>User: Transaction Confirmed (Receipt)
    User->>MCP: Re-sends request with Receipt
    MCP->>Data: Fetches underlying data
    Data-->>MCP: Returns data
    MCP-->>User: Returns 200 OK with data
ON-CHAIN PROOF OF THE SNTL v4 ENGINE
The SNTL Integrity Oracle, which is built on this pattern, is a live, production-grade system.
Wallet: DDxMHJceaNE9tWohpauakaek8Q7P7CJ2jkzhiHRybCmt
Sample transaction: 4BUUzJ3keZ8Mkg97nm3HMHdwoiLfGDAJdK4AyqgnpBrsk1DgA8Rdg7q4JavaeYBZdQDoXktNc9Mk3Tj1NK3ZPKHt
This wallet has executed hundreds of on-chain transactions where agents have paid the SNTL treasury for intelligence. Each transaction is proof that this pattern works at scale, today.
Real example: The SNTL v4 Integrity Oracle Registry
This is the actual production registry for SNTL, demonstrating the value-based pricing model. We sell our unique, ground-truthed Sybil detection for 10,000x the price of our commodity data feeds. Price your value accordingly.
code
JavaScript
// All hitting https://pop-os.tail08831d.ts.net/api/v4/
// Replace with YOUR endpoints, YOUR prices.

// 🔬 FREE TIER: Transparency & Onboarding
{ name: 'sntl_stats', price: 0, method: 'GET',
  description: 'FREE — Live counts of enriched events by threat tier.',
  path: () => `/stats` }

// 📦 COMMODITY TIER: Core Data ($0.01)
{ name: 'sntl_threats_medium', price: 0.01, method: 'GET',
  description: 'Enriched events classified as MEDIUM threat.',
  path: (a) => `/threats/medium?limit=${a.limit}` }

// 📈 PROFESSIONAL TIER: High-Value Feeds ($1.00)
{ name: 'sntl_threats_critical', price: 1.00, method: 'GET',
  description: 'Enriched events classified as CRITICAL threat.',
  path: (a) => `/threats/critical?limit=${a.limit}` }
  
// 💎 ALPHA TIER: Ground-Truthed, Definitive Verdicts ($100.00)
{ name: 'sntl_integrity_verdict', price: 100.00, method: 'GET',
  description: 'A definitive Sybil likelihood score for any Helium hotspot, validated against Hivemapper ground truth.',
  path: (a) => `/integrity/hotspot/${a.hotspot_id}` }
The Technology Stack
Layer	Technology	Purpose
Host	Cloudflare Workers	Serverless, global, zero-overhead execution
Payment	x402 Protocol	Machine-readable, pay-per-query metering
Settlement	Solana / USDC	On-chain, near-instant settlement to your treasury
Schema	Zod	Automatic input validation for API robustness
Manifest	agent-card.json	Standardized discovery by autonomous agents
Your checklist

Fork this repo

Edit src/registry.mjs to define your products and pricing tiers

Update src/rail.mjs to hit your API and set your treasury address

Publish to npm: npm publish

Tell your users: npx -y @your-scope/your-mcp

Activate your on-chain revenue stream
SNTL v4 Ecosystem Links
Resource	Link	Description
Live UI	sntl.site	The human interface: The DePIN Integrity Map
Live A2A Rail	pop-os.tail...	The live endpoints for agent consumption
Agent Manifest	.well-known/agent-card.json	The machine-readable "menu" of our A2A rail
This Pattern	github/substreambc	The open-source foundation for your own DAAS
The SNTL Integrity Pattern by Web3 Solutions, LLC — It is the most direct path from your mind to the global, on-chain economy. Copy it. Use it. Build the future.
