import { baseSepolia } from 'viem/chains';

export const DEFAULT_CHAIN = baseSepolia;
export const CHAIN_ID = baseSepolia.id;
export const CHAIN_NAME = baseSepolia.name;
export const CHAIN_NATIVE_CURRENCY = baseSepolia.nativeCurrency;

// USDC address on Base Sepolia (testnet)
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// MetaMask Facilitator URLs for x402
export const FACILITATOR_URL = {
  [baseSepolia.id]: 'https://tx-sentinel-base-sepolia.api.cx.metamask.io/platform/v2/x402',
};

// Pimlico bundler URL constructor
export const getBundlerUrl = (apiKey: string) => 
  `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${apiKey}`;

// Alchemy RPC URL constructor
export const getAlchemyUrl = (apiKey: string) =>
  `https://base-sepolia.g.alchemy.com/v2/${apiKey}`;