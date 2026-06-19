import { createWalletClient, custom } from 'viem';
import { erc7715ProviderActions } from '@metamask/smart-accounts-kit/actions';
import { baseSepolia } from 'viem/chains';
import { parseUnits } from 'viem';

export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export async function requestPeriodicPermission(
  sessionAccountAddress: string,
  periodAmount: number = 10,
  periodDuration: number = 604800
) {
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum),
  }).extend(erc7715ProviderActions());

  const currentTime = Math.floor(Date.now() / 1000);
  const expiry = currentTime + 60 * 60 * 24 * 30;

  const grantedPermissions = await walletClient.requestExecutionPermissions([
    {
      chainId: baseSepolia.id,
      expiry,
      to: sessionAccountAddress as `0x${string}`,
      permission: {
        type: 'erc20-token-periodic',
        data: {
          tokenAddress: USDC_ADDRESS,
          periodAmount: parseUnits(periodAmount.toString(), 6),
          periodDuration,
          startTime: currentTime,
          justification: 'Vortex Agent budget for autonomous x402 payments',
        },
        isAdjustmentAllowed: false,
      },
    },
  ]);

  return grantedPermissions[0];
}

export async function requestAllowancePermission(
  sessionAccountAddress: string,
  allowanceAmount: number = 50
) {
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum),
  }).extend(erc7715ProviderActions());

  const currentTime = Math.floor(Date.now() / 1000);
  const expiry = currentTime + 60 * 60 * 24 * 30;

  const grantedPermissions = await walletClient.requestExecutionPermissions([
    {
      chainId: baseSepolia.id,
      expiry,
      to: sessionAccountAddress as `0x${string}`,
      permission: {
        type: 'erc20-token-allowance',
        data: {
          tokenAddress: USDC_ADDRESS,
          allowanceAmount: parseUnits(allowanceAmount.toString(), 6),
          startTime: currentTime,
          justification: 'Vortex Agent allowance for x402 payments',
        },
        isAdjustmentAllowed: false,
      },
    },
  ]);

  return grantedPermissions[0];
}

export async function getGrantedPermissions() {
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum),
  }).extend(erc7715ProviderActions());

  return await walletClient.getGrantedExecutionPermissions();
}

export async function getSupportedPermissions() {
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum),
  }).extend(erc7715ProviderActions());

  return await walletClient.getSupportedExecutionPermissions();
}