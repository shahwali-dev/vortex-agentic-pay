import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// Optional: Get Alchemy API key from https://alchemy.com (free)
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// If Alchemy API key is provided, use it; otherwise use public RPC
const RPC_URL = ALCHEMY_API_KEY 
  ? `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  : 'https://sepolia.base.org';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});