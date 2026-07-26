FROM node:20-alpine

WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY src/ ./src/
COPY mcp.json ./
COPY schema/ ./schema/
COPY .well-known/ ./.well-known/

# Safe defaults for introspection.
# WALLET_ENV is intentionally blank — free-tier tools work without it.
# Paid tools require a caller-supplied Solana keypair at runtime.
ENV SNTL_BASE=https://pop-os.tail08831d.ts.net \
    RPC_URL=https://api.mainnet-beta.solana.com \
    MAX_USDC_PER_CALL=1 \
    WALLET_ENV=

# stdio MCP server — no port needed
CMD ["node", "src/server.mjs"]
