export { 
  createSmartAccount, 
  getEnvironment, 
  createNewDelegation,
  createNewRedelegation,
  createOpenDelegationNew,
  createLimitedDelegationNew
} from './delegation/delegationProvider';

export { createX402DelegationProvider, createX402Provider, type X402Provider } from './delegation/x402Provider';

export { 
  requestPeriodicPermission, 
  requestAllowancePermission, 
  getGrantedPermissions, 
  getSupportedPermissions, 
  USDC_ADDRESS 
} from './permissions/erc7715';

export const version = '0.1.0';