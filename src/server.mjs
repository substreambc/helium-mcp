#!/usr/bin/env node
// server.mjs — the MCP face. Auto-generates one tool per registry entry. No UI: the protocol is the UI.
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

await server.connect(new StdioServerTransport());
