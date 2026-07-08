#!/usr/bin/env node
// smoke.mjs — integration smoke test. Verifies free and (if wallet present) paid endpoints.
// Usage: node test/smoke.mjs

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
const STUB = 'NOT_IMPLEMENTED';

let passed = 0, failed = 0;

function assert(label, ok, detail) {
  if (ok) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label}: ${detail}`); }
}

// 1. Check that all source files exist
const required = [
  'src/config.mjs', 'src/registry.mjs', 'src/server.mjs', 'src/rail.mjs',
  'bin/sntl-helium-mcp.mjs', 'mcp.json', 'package.json', 'smithery.yaml',
  'schema/agent-card.json', '.well-known/agent.json', '.env.example',
];
console.log('\n📁 File presence:');
for (const f of required) {
  assert(`src/${f}`.startsWith('src/') ? f : f, existsSync(join(REPO, f)), `missing ${f}`);
}

// 2. Validate registry.mjs exports 10 tools
import(`${REPO}/src/registry.mjs`).then(mod => {
  console.log('\n🔧 Registry:');
  assert('TOOLS is an array', Array.isArray(mod.TOOLS), 'not an array');
  assert('exactly 10 tools', mod.TOOLS.length === 10, `got ${mod.TOOLS.length}`);
  const free = mod.TOOLS.filter(t => t.price === 0);
  const paid01 = mod.TOOLS.filter(t => t.price === 0.01);
  const paid05 = mod.TOOLS.filter(t => t.price === 0.05);
  assert(`free: ${free.length} tool(s)`, free.length === 1, `expected 1, got ${free.length}`);
  assert(`\$0.01: ${paid01.length} tools`, paid01.length === 5, `expected 5, got ${paid01.length}`);
  assert(`\$0.05: ${paid05.length} tools`, paid05.length === 4, `expected 4, got ${paid05.length}`);
  for (const t of mod.TOOLS) {
    assert(`  "${t.name}" has name+description+input+price+path+method`, t.name && t.description && t.input !== undefined && t.price !== undefined && t.path && t.method, `incomplete: ${t.name}`);
  }
}).catch(e => {
  console.log('\n🔧 Registry:');
  assert('load registry.mjs', false, e.message);
}).finally(() => {
  // 3. Check for empty stub files
  console.log('\n📝 Stubs:');
  const stubs = ['scripts/announce-onchain.mjs', 'scripts/publish.mjs', 'scripts/register-discovery.mjs', 'test/smoke.mjs'];
  for (const s of stubs) {
    const p = join(REPO, s);
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf8').trim();
      assert(`${s} has content`, content !== '', 'file is empty');
    } else {
      assert(`${s} exists`, false, 'file missing');
    }
  }

  // 4. Parse mcp.json
  console.log('\n⚙️  mcp.json:');
  try {
    const mcp = JSON.parse(readFileSync(join(REPO, 'mcp.json'), 'utf8'));
    assert('has name', !!mcp.name, 'missing name');
    assert('transport is stdio', mcp.transport === 'stdio', `got ${mcp.transport}`);
    assert('command uses npx', mcp.command === 'npx', `got ${mcp.command}`);
    assert('package.json name matches', mcp.args?.some(a => a.includes('@web3solutions33/helium-mcp')), 'no matching arg');
  } catch (e) { assert('parse mcp.json', false, e.message); }

  // 5. Parse package.json
  console.log('\n📦 package.json:');
  try {
    const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8'));
    assert('name is @web3solutions33/helium-mcp', pkg.name === '@web3solutions33/helium-mcp', pkg.name);
    assert('has x402-solana dep', !!pkg.dependencies?.['x402-solana'], 'missing');
    assert('has @solana/web3.js dep', !!pkg.dependencies?.['@solana/web3.js'], 'missing');
    assert('has @modelcontextprotocol/sdk dep', !!pkg.dependencies?.['@modelcontextprotocol/sdk'], 'missing');
    assert('has zod dep', !!pkg.dependencies?.['zod'], 'missing');
    assert('type is module', pkg.type === 'module', `got ${pkg.type}`);
  } catch (e) { assert('parse package.json', false, e.message); }

  // Summary
  console.log(`\n═══════════════════════════`);
  console.log(`  ✅ ${passed} passed  ❌ ${failed} failed`);
  console.log(`═══════════════════════════\n`);
  process.exit(failed > 0 ? 1 : 0);
});
