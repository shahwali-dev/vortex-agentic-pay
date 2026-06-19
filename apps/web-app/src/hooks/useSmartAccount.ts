import { useState, useCallback } from 'react';
import { createSmartAccount } from '@vortex/smart-account-core';
import { bundlerClient } from '@/lib/clients/bundlerClient';
import { parseEther } from 'viem';
import { publicClient } from '@/lib/clients/publicClient';

export function useSmartAccount() {
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upgradeToSmartAccount = useCallback(async (signerAddress: string, walletClient: any) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Creating smart account for address:', signerAddress);
      const account = await createSmartAccount(signerAddress, walletClient);
      console.log('Smart account created:', account.address);
      setSmartAccount(account);
      return account;
    } catch (err: any) {
      console.error('Smart account creation failed:', err);
      setError(err.message || 'Failed to create smart account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendUserOperation = useCallback(async (toAddress: string, value: string = '0.001') => {
    if (!smartAccount) {
      const err = new Error('Smart account not created. Please upgrade to smart account first.');
      setError(err.message);
      throw err;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('Sending user operation from:', smartAccount.address);
      console.log('To:', toAddress, 'Value:', value);
      
      const hash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls: [{ to: toAddress as `0x${string}`, value: parseEther(value) }],
        maxFeePerGas: BigInt(1_000_000_000),
        maxPriorityFeePerGas: BigInt(1_000_000_000),
      });
      
      console.log('User operation sent! Hash:', hash);
      setUserOpHash(hash);
      
      // Wait for receipt (optional)
      const receipt = await bundlerClient.waitForUserOperationReceipt({ hash });
      console.log('User operation receipt:', receipt);
      
      return { hash, receipt };
    } catch (err: any) {
      console.error('User operation failed:', err);
      setError(err.message || 'Failed to send user operation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [smartAccount]);

  const checkBalance = useCallback(async () => {
    if (!smartAccount) return null;
    try {
      const balance = await publicClient.getBalance({
        address: smartAccount.address,
      });
      return balance;
    } catch (err) {
      console.error('Failed to get balance:', err);
      return null;
    }
  }, [smartAccount]);

  return { 
    smartAccount, 
    upgradeToSmartAccount, 
    sendUserOperation, 
    checkBalance,
    isLoading, 
    userOpHash,
    error 
  };
}