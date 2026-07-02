// config.mjs — env-only, no UI. Free tools need nothing; paid tools need a BYO wallet.
export const config = {
  base: process.env.SNTL_BASE || 'https://a2a.sntl.site',
  // BYO Solana secret key (JSON byte-array OR base58). We custody nothing; the caller pays.
  walletEnv: process.env.WALLET_ENV || '',
  rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
  maxUsdcPerCall: Number(process.env.MAX_USDC_PER_CALL || '1'),
  network: 'solana',
};
