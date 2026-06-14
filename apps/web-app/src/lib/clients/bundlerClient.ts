import { createBundlerClient } from 'viem/account-abstraction';
import { http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { publicClient } from './publicClient';

const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || 'YOUR_API_KEY';

export const bundlerClient = createBundlerClient({
  client: publicClient,
  transport: http(`https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${PIMLICO_API_KEY}`),
});