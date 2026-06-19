'use client';

import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createWalletClient, custom } from 'viem';
import { Implementation, toMetaMaskSmartAccount } from '@metamask/smart-accounts-kit';
import { AccountController } from '@/components/AccountController';
import { AgentTerminal } from '@/components/AgentTerminal';
import { bundlerClient } from '@/lib/clients/bundlerClient';
import { parseEther } from 'viem';

export default function Home() {
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const [publicClient, setPublicClient] = useState<any>(null);

  // Initialize public client
  useEffect(() => {
    const pubClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });
    setPublicClient(pubClient);
  }, []);

  const handleAccountUpdate = async (address: string, account: any) => {
    setSignerAddress(address);
    setSmartAccount(account);
    if (account) {
      setSmartAccountAddress(account.address);
      setStatus(`Smart Account: ${account.address.slice(0, 10)}...`);
    } else if (address) {
      // Check if already a smart account
      try {
        const code = await publicClient?.getCode({ address: address as `0x${string}` });
        if (code && code !== '0x') {
          const walletClient = createWalletClient({
            chain: baseSepolia,
            transport: custom((window as any).ethereum),
            account: address as `0x${string}`,
          });
          const existingAccount = await toMetaMaskSmartAccount({
            client: publicClient,
            implementation: Implementation.Stateless7702,
            address: address as `0x${string}`,
            signer: { walletClient },
          });
          setSmartAccount(existingAccount);
          setSmartAccountAddress(existingAccount.address);
          setStatus(`Smart Account detected: ${existingAccount.address.slice(0, 10)}...`);
        } else {
          setStatus('Wallet connected. Please upgrade to Smart Account');
        }
      } catch (error) {
        setStatus('Wallet connected');
      }
    }
  };

  const handlePermissionGranted = () => {
    setPermissionGranted(true);
    setStatus('ERC-7715 permissions granted! Agent budget active.');
  };

  const sendUserOperation = async () => {
    if (!smartAccount) {
      setStatus('Please upgrade to smart account first');
      return;
    }
    
    setIsLoading(true);
    setStatus('Sending user operation...');
    
    try {
      const hash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls: [{ to: signerAddress as `0x${string}`, value: parseEther('0.0001') }],
        maxFeePerGas: BigInt(1000000000),
        maxPriorityFeePerGas: BigInt(1000000000),
      });
      
      setStatus(`✅ User operation sent! Hash: ${hash.slice(0, 16)}...`);
      
      const receipt = await bundlerClient.waitForUserOperationReceipt({ hash });
      setStatus(`✅ Confirmed! TX: ${receipt.receipt.transactionHash.slice(0, 16)}...`);
      
    } catch (error: any) {
      setStatus(`❌ Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ Vortex Agentic Pay</h1>
        <p style={styles.subtitle}>A2A Coordination & x402 Sovereign Agent Infrastructure</p>
        <p style={styles.badge}>Powered by MetaMask Smart Accounts Kit • 1Shot API • Venice AI</p>
      </header>

      <div style={styles.grid}>
        <AccountController 
          onAccountUpdate={handleAccountUpdate}
          onPermissionGranted={handlePermissionGranted}
          signerAddress={signerAddress}
          smartAccountAddress={smartAccountAddress}
          permissionGranted={permissionGranted}
        />
        
        <AgentTerminal 
          signerAddress={signerAddress}
          smartAccountAddress={smartAccountAddress}
          permissionGranted={permissionGranted}
          onAgentResponse={(response) => setStatus(`Agent: ${response.slice(0, 50)}...`)}
        />
      </div>

      <div style={styles.actionBar}>
        <div style={styles.statusBar}>
          <span>📡 Status: {status}</span>
          {smartAccountAddress && <span>🔐 Smart Account: {smartAccountAddress.slice(0, 10)}...</span>}
        </div>
        <button 
          onClick={sendUserOperation}
          disabled={!smartAccount || isLoading}
          style={!smartAccount || isLoading ? styles.buttonGoldDisabled : styles.buttonGold}
        >
          {isLoading ? 'Processing...' : '🚀 Send User Operation (EIP-7702)'}
        </button>
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: '40px',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    borderBottom: '1px solid rgba(0, 255, 204, 0.2)',
    paddingBottom: '20px',
    marginBottom: '40px',
  },
  title: {
    color: '#00ffcc',
    margin: 0,
    fontSize: '2rem',
    textShadow: '0 0 20px rgba(0, 255, 204, 0.3)',
  },
  subtitle: {
    color: '#888',
    marginTop: '8px',
    fontSize: '0.9rem',
  },
  badge: {
    color: '#666',
    marginTop: '8px',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    marginBottom: '30px',
  },
  actionBar: {
    background: 'rgba(17, 17, 34, 0.6)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 204, 0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '15px',
  },
  statusBar: {
    display: 'flex',
    gap: '20px',
    fontSize: '0.85rem',
    color: '#888',
    fontFamily: 'monospace',
  },
  buttonGold: {
    padding: '12px 24px',
    background: '#ffcc00',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonGoldDisabled: {
    padding: '12px 24px',
    background: '#443300',
    color: '#886600',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
  },
};