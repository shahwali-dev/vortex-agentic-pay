'use client';

import { useState, useCallback } from 'react';

interface AgentTerminalProps {
  signerAddress: string | null;
  smartAccountAddress: string | null;
  permissionGranted: boolean;
  onAgentResponse?: (response: string) => void;
}

export function AgentTerminal({ signerAddress, smartAccountAddress, permissionGranted, onAgentResponse }: AgentTerminalProps) {
  const [agentResponse, setAgentResponse] = useState<string>('Idle');
  const [isLoading, setIsLoading] = useState(false);

  const triggerAgent = useCallback(async () => {
    if (!permissionGranted) {
      setAgentResponse('Please grant agent budget first');
      return;
    }
    
    setIsLoading(true);
    setAgentResponse('Contacting Venice AI via x402...');
    
    try {
      const response = await fetch('http://localhost:3001/api/agent/reason');
      const data = await response.json();
      const finalResponse = data.agentResponse;
      setAgentResponse(finalResponse);
      onAgentResponse?.(finalResponse);
    } catch (error) {
      setAgentResponse('Agent: Active | x402 Ready | Venice AI: Mock Mode');
    } finally {
      setIsLoading(false);
    }
  }, [permissionGranted, onAgentResponse]);

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>2. Executive Agent Terminal</h2>
      
      <div style={styles.terminal}>
        <div style={styles.terminalLine}>[System Status]: {isLoading ? '🔄 Processing' : '✅ Active'}</div>
        <div style={styles.terminalLine}>[Signer]: {signerAddress ? `${signerAddress.slice(0, 10)}...` : 'None'}</div>
        <div style={styles.terminalLine}>[Smart Account]: {smartAccountAddress ? `${smartAccountAddress.slice(0, 10)}...` : 'None'}</div>
        <div style={styles.terminalLine}>[ERC-7715]: {permissionGranted ? '✅ Granted' : '⏳ Pending'}</div>
        <div style={styles.terminalResponse}>&gt; {agentResponse}</div>
      </div>

      <button 
        onClick={triggerAgent} 
        disabled={!permissionGranted || isLoading}
        style={permissionGranted && !isLoading ? styles.buttonAgent : styles.buttonDisabled}
      >
        {isLoading ? 'Processing x402 payment...' : '🤖 Trigger Agent Intelligence (x402 • $0.01)'}
      </button>
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
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '20px',
    color: '#f5f5f5',
  },
  terminal: {
    background: '#000',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#00ff66',
    border: '1px solid rgba(0, 255, 102, 0.2)',
    minHeight: '160px',
  },
  terminalLine: {
    marginBottom: '6px',
    color: '#00ff66',
  },
  terminalResponse: {
    marginTop: '12px',
    color: '#fff',
    borderTop: '1px solid #333',
    paddingTop: '12px',
    wordBreak: 'break-word' as const,
  },
  buttonAgent: {
    padding: '15px',
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
  },
  buttonDisabled: {
    padding: '15px',
    background: '#333',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'not-allowed',
    marginTop: '20px',
    width: '100%',
  },
};