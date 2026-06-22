import { mainnet } from 'wagmi/chains';

export const ARTEMIS_CHAIN = mainnet;

export const ARTEMIS_CONTRACTS = {
  token: '0x06b97abafca402d01352bd37c81cea43c6142a49',
  presale: '0xDd5c7EAF45fbe28a877a7ec7b8Ffa2D8cE15F3af',
  teamLock: '0x3ad9Fe5c5dAaf7A6f1991F29494F1A78f6cb9F95',
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ethUsdPriceFeed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
};

export const ARTEMIS_EXPLORER_TX_BASE = 'https://etherscan.io/tx';
export const ARTEMIS_EXPLORER_ADDRESS_BASE = 'https://etherscan.io/address';

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
    name: 'buyWithETH',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
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
  {
    type: 'function',
    name: 'quoteForETH',
    stateMutability: 'view',
    inputs: [{ name: 'ethAmountWei', type: 'uint256' }],
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
    name: 'quoteEthUsdValue',
    stateMutability: 'view',
    inputs: [{ name: 'ethAmountWei', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getEthUsdPrice',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalEthRaised',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
];
