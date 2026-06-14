import { createx402DelegationProvider as metamaskCreateProvider } from '@metamask/smart-accounts-kit/experimental';

export function createX402DelegationProvider(account: any, parentPermissionContext?: any, from?: string) {
  return metamaskCreateProvider({
    account,
    ...(parentPermissionContext && { parentPermissionContext, from }),
  });
}

export async function createDelegationForPayment(smartAccount: any, amount: string, tokenAddress: string) {
  const delegationProvider = createX402DelegationProvider({
    account: smartAccount,
  });
  
  return delegationProvider;
}

export interface X402Provider {
  sendPayment: (amount: string, to: string) => Promise<string>;
  verifyPayment: (paymentId: string) => Promise<boolean>;
}

export const createX402Provider = (apiKey: string): X402Provider => {
  return {
    sendPayment: async (amount: string, to: string) => {
      console.log(`[x402] Sending payment: ${amount} to ${to}`);
      return `payment_${Date.now()}`;
    },
    verifyPayment: async (paymentId: string) => {
      console.log(`[x402] Verifying payment: ${paymentId}`);
      return true;
    }
  };
};