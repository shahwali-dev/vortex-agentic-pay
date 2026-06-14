'use client';

import { useState, useCallback } from 'react';
import { getWalletClient } from '@/lib/clients/walletClient';
import { useSmartAccount } from '@/hooks/useSmartAccount';
import { requestPeriodicPermission, USDC_ADDRESS } from '@vortex/smart-account-core';

interface AccountControllerProps {
  onAccountUpdate: (address: string, smartAccount: any) => void;
  onPermissionGranted: () => void;
  signerAddress: string | null;
  smartAccountAddress: string | null;
  permissionGranted: boolean;
}

export function AccountController({ 
  onAccountUpdate, 
  onPermissionGranted,
  signerAddress,
  smartAccountAddress,
  permissionGranted
}: AccountControllerProps) {
  const { upgradeToSmartAccount, isLoading } = useSmartAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isGranting, setIsGranting] = useState(false);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      const { walletClient, address } = await getWalletClient();
      onAccountUpdate(address, null);
    } catch (error: any) {
      console.error('Connection failed:', error);
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  }, [onAccountUpdate]);

  const upgradeAccount = useCallback(async () => {
    if (!signerAddress) return;
    setIsUpgrading(true);
    try {
      const { walletClient } = await getWalletClient();
      const account = await upgradeToSmartAccount(signerAddress, walletClient);
      onAccountUpdate(signerAddress, account);
    } catch (error: any) {
      console.error('Upgrade failed:', error);
      alert('Please upgrade manually in MetaMask Flask: Settings → Smart Account → Set up');
    } finally {
      setIsUpgrading(false);
    }
  }, [signerAddress, upgradeToSmartAccount, onAccountUpdate]);

  const grantPermission = useCallback(async () => {
    if (!smartAccountAddress) {
      alert('Please upgrade to smart account first');
      return;
    }
    setIsGranting(true);
    try {
      await requestPeriodicPermission(smartAccountAddress, 10, 604800);
      onPermissionGranted();
    } catch (error: any) {
      console.error('Permission failed:', error);
      alert(`Permission denied: ${error.message}`);
    } finally {
      setIsGranting(false);
    }
  }, [smartAccountAddress, onPermissionGranted]);

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>1. Sovereign Account Controller</h2>
      
      <div style={styles.buttonGroup}>
        <button 
          onClick={connectWallet}
          disabled={isConnecting}
          style={signerAddress ? styles.buttonSuccess : styles.buttonPrimary}
        >
          {isConnecting ? 'Connecting...' : (signerAddress ? `✓ ${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}` : 'Connect MetaMask Flask')}
        </button>

        <button 
          onClick={upgradeAccount}
          disabled={!signerAddress || isUpgrading}
          style={smartAccountAddress ? styles.buttonSuccess : styles.buttonSecondary}
        >
          {isUpgrading ? 'Upgrading...' : (smartAccountAddress ? '✓ Smart Account Active (EIP-7702)' : 'Upgrade to Smart Account')}
        </button>

        <button 
          onClick={grantPermission}
          disabled={!smartAccountAddress || permissionGranted || isGranting}
          style={permissionGranted ? styles.buttonSuccess : styles.buttonWarning}
        >
          {isGranting ? 'Requesting...' : (permissionGranted ? '✓ Advanced Permissions Active (ERC-7715)' : 'Grant Agent Budget (10 USDC/Week)')}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(17, 17, 34, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 204, 0.15)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '20px',
    color: '#f5f5f5',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  buttonPrimary: {
    padding: '12px',
    background: '#00ffcc',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '12px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buttonWarning: {
    padding: '12px',
    background: '#ff007a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buttonSuccess: {
    padding: '12px',
    background: '#1a5f3a',
    color: '#00ff88',
    border: '1px solid #00ff88',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};