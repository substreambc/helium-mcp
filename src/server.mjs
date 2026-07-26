#!/usr/bin/env node
/////////////// sentinel/a2a/src/server.mjs 
/////////////////NOTE: DO NOT TOUCH rail.ts////////////
//— the MCP face. Auto-generates one tool per registry entry. No UI: the protocol is the UI.
// Free tools run open; paid tools settle x402 (BYO wallet) and return an on-chain receipt.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TOOLS } from './registry.mjs';
import { callFree, callPaid } from './rail.mjs';

const server = new McpServer({ name: 'sntl-helium', version: '0.1.0' });

for (const t of TOOLS) {
  const tag = t.price > 0 ? ` [x402: $${t.price.toFixed(2)} USDC/call]` : ' [FREE]';
  server.tool(t.name, t.description + tag, t.input, async (args) => {
    try {
      const r = t.price > 0 ? await callPaid(t, args) : await callFree(t, args);
      if (r.status !== 200) {
        return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: 'call_failed', status: r.status, detail: r.data }) }] };
      }
      const out = { data: r.data };
      if (r.payer) out._receipt = { payer: r.payer, price_usdc: t.price, x_payment_response: r.receipt };
      return { content: [{ type: 'text', text: JSON.stringify(out) }] };
    } catch (e) {
      return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: String(e?.message || e) }) }] };
    }
  });
}

// 📢 HUMAN UX: Print instructions to stderr (ignored by MCP protocol, visible to humans)
console.error(`
===================================================================
🥷 SNTL Helium MCP Server is LIVE (Machine-to-Machine Mode)
===================================================================
⚠️  If you are a human reading this, the server is waiting for 
    an AI client to speak to it via stdio. 
    
    THIS BLINKING CURSOR IS EXPECTED BEHAVIOR.

🛠️  NEXT STEPS FOR HUMANS:
    Do not run this directly in your terminal. Add this exact 
    configuration to your AI client (e.g., Claude Desktop config):

    "mcpServers": {
      "helium-x402": {
        "command": "yarn",
        "args": ["dlx", "@web3solutions33/helium-mcp"],
        "env": {
          "WALLET_ENV": "<YOUR_SOLANA_PRIVATE_KEY_BASE58_OR_JSON>"
        }
      }
    }

    Once added, restart your AI client. It will boot this process 
    silently in the background and negotiate the x402 payments.
===================================================================
`);

await server.connect(new StdioServerTransport());
