import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

export const getWalletClient = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Window object not available (server-side)');
  }
  
  if (!window.ethereum) {
    throw new Error('MetaMask Flask not installed. Please install MetaMask Flask extension.');
  }
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const walletClient = createWalletClient({
    account: accounts[0] as `0x${string}`,
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });
  
  return { walletClient, address: accounts[0] };
};