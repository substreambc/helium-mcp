#!/usr/bin/env node
// register-discovery.mjs — registers the MCP agent with the A2A Registry.
// Usage: node scripts/register-discovery.mjs
// Docs: https://a2a-registry.org

const pkg = JSON.parse(require('fs').readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const agentCard = JSON.parse(require('fs').readFileSync(new URL('../schema/agent-card.json', import.meta.url), 'utf8'));

const REGISTRY_URL = process.env.A2A_REGISTRY_URL || 'https://a2a-registry.org/api/agents';

const body = {
  name: agentCard.name,
  description: agentCard.description,
  manifest_url: 'https://pop-os.tail08831d.ts.net/.well-known/agent-card.json',
  openapi_url: 'https://pop-os.tail08831d.ts.net',
  version: pkg.version,
  category: 'Data',
  target_audience: 'Developers',
  capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
  skills: [
    { id: 'query-datalake', name: 'Query the Helium intelligence datalake', description: 'Run SQL SELECT over enriched Helium/Solana events', tags: ['helium', 'depin', 'solana', 'sql'] },
    { id: 'lookup-event', name: 'Look up one enriched event', description: 'Fetch a single enriched event by transaction_id', tags: ['helium', 'event-lookup', 'forensics'] },
    { id: 'threats-critical', name: 'Critical threats', description: 'Enriched events classified CRITICAL threat', tags: ['threat', 'critical', 'security'] },
    { id: 'stats', name: 'Threat distribution', description: 'Live counts of enriched events by threat tier', tags: ['meta', 'stats'] },
  ],
};

console.log(`Registering with A2A Registry at ${REGISTRY_URL}...`);
const res = await fetch(REGISTRY_URL, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});
const data = await res.json();
if (res.ok) {
  console.log(`✅ Registered: ${data.id || data.url || 'OK'}`);
} else {
  console.error(`Registration failed: ${res.status} ${JSON.stringify(data)}`);
  process.exit(1);
}
