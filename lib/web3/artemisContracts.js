import { sepolia } from 'wagmi/chains';

export const ARTEMIS_CHAIN = sepolia;

export const ARTEMIS_SEPOLIA_CONTRACTS = {
  token: '0x9FEce26a9bd152A40CFF6F2387DA319d425E71d2',
  presale: '0xab48DD77d97e7908738267059c39B1595379890E',
  usdc: '0x4C213dE3D2E56Be0cBCF05C2e521b26d810e2e9f',
  usdt: '0x5fA6d732285FB43cd65a4f2E4A6fe787A771F022',
};

export const ARTEMIS_EXPLORER_TX_BASE = 'https://sepolia.etherscan.io/tx';

export const ERC20_APPROVAL_ABI = [
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export const ARTEMIS_PRESALE_ABI = [
  {
    type: 'function',
    name: 'buyWithUSDT',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'buyWithUSDC',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimTokens',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getSaleStatus',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_saleActive', type: 'bool' },
      { name: '_claimActive', type: 'bool' },
      { name: '_paused', type: 'bool' },
      { name: '_currentBatchId', type: 'uint256' },
      { name: '_totalTokensSold', type: 'uint256' },
      { name: '_totalUsdRaised', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getBatchInfo',
    stateMutability: 'view',
    inputs: [{ name: 'batchId', type: 'uint256' }],
    outputs: [
      { name: 'tokenCap', type: 'uint256' },
      { name: 'tokensSold', type: 'uint256' },
      { name: 'priceUsd', type: 'uint256' },
      { name: 'tokensRemaining', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getBatchCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'presaleTokenCap',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'minimumPurchaseUsd',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getTokensRemainingInPresale',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getBuyerDashboard',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'totalUsdSpent', type: 'uint256' },
      { name: 'totalTokensAllocated', type: 'uint256' },
      { name: 'totalTokensClaimed_', type: 'uint256' },
      { name: 'claimableAmount', type: 'uint256' },
      { name: 'purchaseCount', type: 'uint256' },
      { name: 'purchaseIds', type: 'uint256[]' },
    ],
  },
  {
    type: 'function',
    name: 'quoteForUSDT',
    stateMutability: 'view',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'usdUsed', type: 'uint256' },
          { name: 'tokensAllocated', type: 'uint256' },
          { name: 'startBatchId', type: 'uint256' },
          { name: 'endBatchId', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'quoteForUSDC',
    stateMutability: 'view',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'usdUsed', type: 'uint256' },
          { name: 'tokensAllocated', type: 'uint256' },
          { name: 'startBatchId', type: 'uint256' },
          { name: 'endBatchId', type: 'uint256' },
        ],
      },
    ],
  },
];
