#!/usr/bin/env node
// publish.mjs — publishes @web3solutions33/helium-mcp to npm.
// Usage: node scripts/publish.mjs
// Prerequisites: npm login (or NPM_TOKEN env var), git tag

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
const pkg = JSON.parse(require('fs').readFileSync(join(REPO, 'package.json'), 'utf8'));

console.log(`Publishing ${pkg.name}@${pkg.version}...`);

// Verify package.json
if (pkg.private) { console.error('package.json is private — remove "private": true'); process.exit(1); }

// Git tag
try {
  execSync(`git tag v${pkg.version}`, { cwd: REPO, stdio: 'pipe' });
  execSync('git push --tags', { cwd: REPO, stdio: 'pipe' });
  console.log(`Tagged v${pkg.version} and pushed`);
} catch (e) {
  console.log(`Tag warning: ${e.message}`);
}

// Publish
try {
  execSync('npm publish --access public', { cwd: REPO, stdio: 'inherit' });
  console.log(`✅ Published ${pkg.name}@${pkg.version}`);
} catch (e) {
  console.error(`Publish failed: ${e.message}`);
  process.exit(1);
}
