// registry.mjs — THE CONTRACT. Machine-first: this file IS the interface + the docs + the price sheet.
// The server auto-generates MCP tools from it; nothing is hand-wired. Paths map to the proven a2a rail.
import { z } from 'zod';

const limit = z.number().int().min(1).max(1000).default(50).describe('max rows (<=1000)');

export const TOOLS = [
  // ---- FREE hook (no wallet) — verified against live rail: only /ledger returns 200 unpaid ----
  { name: 'helium_ledger', price: 0, method: 'GET',
    description: "FREE transparency: a wallet's x402 payment + query history against SNTL.",
    input: { wallet: z.string().describe('Solana wallet address') },
    path: (a) => `/api/v2/ledger/${encodeURIComponent(a.wallet)}` },

  // ---- STANDARD $0.01 (rail gates /stats with 402 — it is PAID, not free) ----
  { name: 'helium_stats', price: 0.01, method: 'GET',
    description: 'Live counts of enriched Helium/Solana DePIN events by threat tier.',
    input: {}, path: () => '/api/v2/stats' },

  { name: 'helium_query', price: 0.01, method: 'POST',
    description: 'Read-only SQL SELECT over 285k AI-graded Helium events. SELECT-only, LIMIT<=1000, allow-listed tables.',
    input: { sql: z.string().describe('a single SELECT statement') },
    path: () => '/api/v2/query', body: (a) => ({ sql: a.sql }) },

  { name: 'helium_threats', price: 0.01, method: 'GET',
    description: 'Enriched events at a threat tier.',
    input: { tier: z.enum(['critical', 'high', 'medium', 'low', 'pending']), limit },
    path: (a) => `/api/v2/threats/${a.tier}?limit=${a.limit ?? 50}` },

  { name: 'helium_anomalies', price: 0.01, method: 'GET',
    description: 'Highest anomaly-score enriched events.',
    input: { limit }, path: (a) => `/api/v2/anomalies?limit=${a.limit ?? 50}` },

  { name: 'helium_event', price: 0.01, method: 'GET',
    description: 'Fetch a single enriched event by transaction_id.',
    input: { transaction_id: z.string() },
    path: (a) => `/api/v2/event/${encodeURIComponent(a.transaction_id)}` },

  // ---- PREMIUM $0.05 (the moat: causal / forensic / audience) ----
  { name: 'helium_chronicle', price: 0.05, method: 'GET',
    description: 'PREMIUM causal chains — world-state (time/space/power) reconstruction. 233k rows, fresh.',
    input: { limit }, path: (a) => `/api/v2/chronicle?limit=${a.limit ?? 50}` },

  { name: 'helium_escalation', price: 0.05, method: 'GET',
    description: 'PREMIUM tiered LLM verdict trail (SLM 0.5B -> SLM 3.5B -> LLM).',
    input: { limit }, path: (a) => `/api/v2/escalation?limit=${a.limit ?? 50}` },

  { name: 'helium_geo', price: 0.05, method: 'GET',
    description: 'PREMIUM H3 geospatial hotspot resolution.',
    input: { limit }, path: (a) => `/api/v2/geo?limit=${a.limit ?? 50}` },

  { name: 'helium_wallets', price: 0.05, method: 'GET',
    description: 'PREMIUM scored wallet audience pools.',
    input: { pool: z.enum(['target', 'hvt-anomaly', 'architects', 'paid', 'critical', 'pool', 'connected', 'blink-ready']), limit },
    path: (a) => `/api/v2/wallets/${a.pool}?limit=${a.limit ?? 50}` },
];
