import { 
  toMetaMaskSmartAccount, 
  Implementation, 
  getSmartAccountsEnvironment,
  createDelegation as metamaskCreateDelegation,
  createOpenDelegation as metamaskCreateOpenDelegation,
  ScopeType,
  CaveatType
} from '@metamask/smart-accounts-kit';
import { createPublicClient, http, parseUnits, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function createSmartAccount(signerAddress: string, walletClient: any) {
  const smartAccount = await toMetaMaskSmartAccount({
    // cast to any to avoid type incompatibility between different viem types
    client: publicClient as any,
    implementation: Implementation.Stateless7702,
    address: signerAddress as `0x${string}`,
    signer: { walletClient },
  });
  return smartAccount;
}

export async function getEnvironment() {
  return getSmartAccountsEnvironment(baseSepolia.id);
}

export async function createNewDelegation(
  fromAddress: string,
  toAddress: string,
  maxAmount: string,
  tokenAddress?: string
) {
  const environment = await getEnvironment();
  
  const delegation = metamaskCreateDelegation({
    from: fromAddress as `0x${string}`,
    to: toAddress as `0x${string}`,
    environment,
    scope: tokenAddress
      ? {
          type: ScopeType.Erc20TransferAmount,
          tokenAddress: tokenAddress as `0x${string}`,
          maxAmount: parseUnits(maxAmount, 6),
        }
      : {
          type: ScopeType.NativeTokenTransferAmount,
          maxAmount: parseEther(maxAmount),
        },
  });
  
  return delegation;
}

export async function createNewRedelegation(
  parentDelegation: any,
  fromAddress: string,
  toAddress: string,
  maxAmount: string,
  tokenAddress?: string
) {
  const environment = await getEnvironment();
  
  const redelegation = metamaskCreateDelegation({
    from: fromAddress as `0x${string}`,
    to: toAddress as `0x${string}`,
    environment,
    parentDelegation,
    scope: tokenAddress
      ? {
          type: ScopeType.Erc20TransferAmount,
          tokenAddress: tokenAddress as `0x${string}`,
          maxAmount: parseUnits(maxAmount, 6),
        }
      : {
          type: ScopeType.NativeTokenTransferAmount,
          maxAmount: parseEther(maxAmount),
        },
  });
  
  return redelegation;
}

export async function createOpenDelegationNew(
  fromAddress: string,
  maxAmount: string
) {
  const environment = await getEnvironment();
  
  const delegation = metamaskCreateOpenDelegation({
    from: fromAddress as `0x${string}`,
    environment,
    scope: {
      type: ScopeType.NativeTokenTransferAmount,
      maxAmount: parseEther(maxAmount),
    },
  });
  
  return delegation;
}

export async function createLimitedDelegationNew(
  fromAddress: string,
  toAddress: string,
  maxAmount: string,
  maxCalls: number = 1
) {
  const environment = await getEnvironment();
  
  const delegation = metamaskCreateDelegation({
    from: fromAddress as `0x${string}`,
    to: toAddress as `0x${string}`,
    environment,
    scope: {
      type: ScopeType.NativeTokenTransferAmount,
      maxAmount: parseEther(maxAmount),
    },
    caveats: [
      {
        type: CaveatType.LimitedCalls,
        limit: maxCalls,
      },
      {
        type: CaveatType.Timestamp,
        afterThreshold: Math.floor(Date.now() / 1000),
        beforeThreshold: Math.floor(Date.now() / 1000) + 86400,
      },
    ],
  });
  
  return delegation;
}