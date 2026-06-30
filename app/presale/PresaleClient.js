'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  PlusCircle,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';

import {
  ARTEMIS_CHAIN,
  ARTEMIS_CONTRACTS,
  ARTEMIS_EXPLORER_ADDRESS_BASE,
  ARTEMIS_EXPLORER_TX_BASE,
  ARTEMIS_PRESALE_ABI,
  ERC20_APPROVAL_ABI,
} from '@/lib/web3/artemisContracts';
import MobileSiteMenu from '../components/MobileSiteMenu';
import {
  isUserRejectedError,
  mapTransactionErrorToNotice,
  mapWalletErrorToNotice,
} from '@/lib/web3/errors';
import { watchArtemisToken } from '@/lib/web3/watchAsset';

const TOKEN_DECIMALS = 18;
const STABLE_DECIMALS = 6;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const acceptedAssets = [
  {
    symbol: 'ETH',
    label: 'ETH',
    decimals: 18,
    isNative: true,
    buyFunction: 'buyWithETH',
    quoteFunction: 'quoteForETH',
  },
  {
    symbol: 'USDC',
    label: 'USDC',
    decimals: STABLE_DECIMALS,
    isNative: false,
    address: ARTEMIS_CONTRACTS.usdc,
    buyFunction: 'buyWithUSDC',
    quoteFunction: 'quoteForUSDC',
  },
  {
    symbol: 'USDT',
    label: 'USDT',
    decimals: STABLE_DECIMALS,
    isNative: false,
    address: ARTEMIS_CONTRACTS.usdt,
    buyFunction: 'buyWithUSDT',
    quoteFunction: 'quoteForUSDT',
  },
];

function Button({ className = '', variant = 'default', children, type = 'button', ...props }) {
  const base =
    'inline-flex items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default:
      'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-white hover:from-blue-400 hover:via-sky-300 hover:to-cyan-200',
    outline:
      'border border-blue-400/30 bg-blue-500/5 text-blue-100 hover:bg-blue-500/10',
    ghost: 'text-blue-100 hover:bg-blue-500/10',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function normaliseConnectorName(name = '') {
  const lower = name.toLowerCase();

  if (lower.includes('meta')) return 'MetaMask';
  if (lower.includes('coinbase')) return 'Coinbase Wallet';
  if (lower.includes('walletconnect')) return 'WalletConnect';

  return name;
}

function safeParsePaymentAmount(value, decimals) {
  const normalized = String(value || '').trim().replace(',', '.');

  const pattern = new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);

  if (!normalized || !pattern.test(normalized)) {
    return 0n;
  }

  try {
    return parseUnits(normalized, decimals);
  } catch {
    return 0n;
  }
}

function formatTokenAmount(value, maximumFractionDigits = 2) {
  const amount = Number(formatUnits(value || 0n, TOKEN_DECIMALS));
  return amount.toLocaleString(undefined, { maximumFractionDigits });
}

function formatStableAmount(value, maximumFractionDigits = 2) {
  const amount = Number(formatUnits(value || 0n, STABLE_DECIMALS));
  return amount.toLocaleString(undefined, { maximumFractionDigits });
}

function formatPaymentAmount(value, asset, maximumFractionDigits = 6) {
  const amount = Number(formatUnits(value || 0n, asset.decimals));
  return amount.toLocaleString(undefined, { maximumFractionDigits });
}

function formatUsd(value, maximumFractionDigits = 2) {
  return `$${formatStableAmount(value, maximumFractionDigits)}`;
}

function tupleValue(data, index, fallback) {
  if (!data) return fallback;
  return data[index] ?? fallback;
}

function structValue(data, index, key, fallback) {
  if (!data) return fallback;
  return data[key] ?? data[index] ?? fallback;
}

function percentage(numerator, denominator) {
  if (!denominator || denominator === 0n) return 0;
  return Number((numerator * 10000n) / denominator) / 100;
}

function NumberInput({ label, value, onChange, suffix, minAmount }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_12px_28px_rgba(2,6,23,0.22)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.24em] text-blue-200/45">{label}</div>
        {minAmount > 0n && (
          <div className="text-xs text-blue-100/45">Min {formatUsd(minAmount, 0)}</div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <input
          type="number"
          min="0"
          step="0.000001"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-3xl font-semibold text-white outline-none"
          placeholder="0"
          inputMode="decimal"
          aria-label={`${label} in ${suffix}`}
        />
        <div className="whitespace-nowrap text-sm text-blue-100/60">{suffix}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/15 bg-white/[0.06] px-3 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.22)] sm:px-4">
      <div className="whitespace-nowrap text-[9px] uppercase leading-4 tracking-normal text-blue-200/45">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export default function ArtemisPresalePage() {
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState('ETH');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletNotice, setWalletNotice] = useState(null);
  const [transactionNotice, setTransactionNotice] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [activeTxHash, setActiveTxHash] = useState(null);
  const [txPhase, setTxPhase] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [isAddingToken, setIsAddingToken] = useState(false);

  const { address, isConnected, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const {
    writeContractAsync,
    isPending: isOpeningWallet,
    error: writeError,
  } = useWriteContract();

  const selectedAsset = useMemo(
    () => acceptedAssets.find((asset) => asset.symbol === selectedAssetSymbol) || acceptedAssets[0],
    [selectedAssetSymbol]
  );

  const parsedPaymentAmount = useMemo(
    () => safeParsePaymentAmount(paymentAmount, selectedAsset.decimals),
    [paymentAmount, selectedAsset.decimals]
  );

  const saleStatusRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'getSaleStatus',
    chainId: ARTEMIS_CHAIN.id,
    query: {
      refetchInterval: 15000,
    },
  });

  const presaleCapRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'presaleTokenCap',
    chainId: ARTEMIS_CHAIN.id,
  });

  const minimumPurchaseRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'minimumPurchaseUsd',
    chainId: ARTEMIS_CHAIN.id,
  });

  const batchCountRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'getBatchCount',
    chainId: ARTEMIS_CHAIN.id,
  });

  const saleActive = tupleValue(saleStatusRead.data, 0, false);
  const claimActive = tupleValue(saleStatusRead.data, 1, false);
  const salePaused = tupleValue(saleStatusRead.data, 2, false);
  const currentBatchId = tupleValue(saleStatusRead.data, 3, 0n);
  const totalTokensSold = tupleValue(saleStatusRead.data, 4, 0n);
  const totalUsdRaised = tupleValue(saleStatusRead.data, 5, 0n);
  const presaleCap = presaleCapRead.data || 0n;
  const minimumPurchaseUsd = minimumPurchaseRead.data || 0n;
  const batchCount = batchCountRead.data || 0n;

  const currentBatchRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'getBatchInfo',
    args: [currentBatchId],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: batchCount > 0n,
      refetchInterval: 15000,
    },
  });

  const buyerDashboardRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'getBuyerDashboard',
    args: [address || ZERO_ADDRESS],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address),
      refetchInterval: 15000,
    },
  });

  const allowanceRead = useReadContract({
    abi: ERC20_APPROVAL_ABI,
    address: selectedAsset.address || ARTEMIS_CONTRACTS.usdt,
    functionName: 'allowance',
    args: [address || ZERO_ADDRESS, ARTEMIS_CONTRACTS.presale],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address && !selectedAsset.isNative),
      refetchInterval: 15000,
    },
  });

  const balanceRead = useReadContract({
    abi: ERC20_APPROVAL_ABI,
    address: selectedAsset.address || ARTEMIS_CONTRACTS.usdt,
    functionName: 'balanceOf',
    args: [address || ZERO_ADDRESS],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address && !selectedAsset.isNative),
      refetchInterval: 15000,
    },
  });

  const nativeBalanceRead = useBalance({
    address,
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address && selectedAsset.isNative),
      refetchInterval: 15000,
    },
  });

  const quoteRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: selectedAsset.quoteFunction,
    args: [parsedPaymentAmount],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: parsedPaymentAmount > 0n,
    },
  });

  const ethUsdValueRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_CONTRACTS.presale,
    functionName: 'quoteEthUsdValue',
    args: [parsedPaymentAmount],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(selectedAsset.isNative && parsedPaymentAmount > 0n),
    },
  });

  const {
    isLoading: isConfirmingTransaction,
    isSuccess: isTransactionConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: activeTxHash || undefined,
    chainId: ARTEMIS_CHAIN.id,
  });

  const selectedWalletName = connector ? normaliseConnectorName(connector.name) : null;
  const isOnMainnet = chain?.id === ARTEMIS_CHAIN.id;
  const allowance = selectedAsset.isNative ? parsedPaymentAmount : allowanceRead.data || 0n;
  const selectedBalance = selectedAsset.isNative
    ? nativeBalanceRead.data?.value || 0n
    : balanceRead.data || 0n;
  const approvalNeeded =
    !selectedAsset.isNative && parsedPaymentAmount > 0n && allowance < parsedPaymentAmount;
  const hasEnoughBalance = selectedBalance >= parsedPaymentAmount;
  const quoteUsdUsed = structValue(quoteRead.data, 0, 'usdUsed', 0n);
  const quotedTokens = structValue(quoteRead.data, 1, 'tokensAllocated', 0n);
  const quoteStartBatch = structValue(quoteRead.data, 2, 'startBatchId', currentBatchId);
  const quoteEndBatch = structValue(quoteRead.data, 3, 'endBatchId', currentBatchId);
  const hasPaymentUsdValue = !selectedAsset.isNative || ethUsdValueRead.data !== undefined;
  const paymentUsdValue = selectedAsset.isNative
    ? ethUsdValueRead.data || 0n
    : parsedPaymentAmount;
  const meetsMinimum =
    parsedPaymentAmount > 0n &&
    hasPaymentUsdValue &&
    (!minimumPurchaseUsd || paymentUsdValue >= minimumPurchaseUsd);
  const quoteUsesFullAmount =
    parsedPaymentAmount === 0n ||
    quoteUsdUsed === paymentUsdValue;

  const batchTokenCap = tupleValue(currentBatchRead.data, 0, 0n);
  const batchTokensSold = tupleValue(currentBatchRead.data, 1, 0n);
  const currentPriceUsd = tupleValue(currentBatchRead.data, 2, 0n);
  const batchTokensRemaining = tupleValue(currentBatchRead.data, 3, 0n);

  const totalTokensRemaining = presaleCap > totalTokensSold ? presaleCap - totalTokensSold : 0n;
  const totalSoldPercent = percentage(totalTokensSold, presaleCap);
  const batchSoldPercent = percentage(batchTokensSold, batchTokenCap);

  const buyerUsdSpent = tupleValue(buyerDashboardRead.data, 0, 0n);
  const buyerTokensAllocated = tupleValue(buyerDashboardRead.data, 1, 0n);
  const buyerTokensClaimed = tupleValue(buyerDashboardRead.data, 2, 0n);
  const buyerClaimable = tupleValue(buyerDashboardRead.data, 3, 0n);
  const buyerPurchaseCount = tupleValue(buyerDashboardRead.data, 4, 0n);

  const isSubmittingTransaction = isOpeningWallet || isConfirmingTransaction;
  const explorerUrl = activeTxHash ? `${ARTEMIS_EXPLORER_TX_BASE}/${activeTxHash}` : null;

  const primaryButtonLabel = useMemo(() => {
    if (!isConnected) return 'Connect Wallet';
    if (!isOnMainnet) return 'Switch to Ethereum';
    if (isOpeningWallet) return 'Opening wallet...';
    if (isConfirmingTransaction) return txPhase === 'approve' ? 'Confirming approval...' : 'Confirming transaction...';
    if (claimActive) return 'Buying closed - claims active';
    if (parsedPaymentAmount <= 0n) return 'Enter contribution amount';
    if (approvalNeeded) return `Approve ${selectedAsset.symbol}`;
    return `Buy ARMN with ${selectedAsset.symbol}`;
  }, [
    approvalNeeded,
    claimActive,
    isConnected,
    isConfirmingTransaction,
    isOnMainnet,
    isOpeningWallet,
    parsedPaymentAmount,
    selectedAsset.symbol,
    txPhase,
  ]);

  const primaryBlockReasons = useMemo(() => {
    if (!isConnected || !isOnMainnet) return [];

    const reasons = [];

    if (!saleActive) {
      reasons.push('The presale contract is not active.');
    }

    if (salePaused) {
      reasons.push('The presale contract is paused.');
    }

    if (claimActive) {
      reasons.push('Buying is closed because claims are active on this Ethereum contract.');
    }

    if (parsedPaymentAmount <= 0n) {
      reasons.push('Enter a contribution amount.');
    }

    if (
      parsedPaymentAmount > 0n &&
      selectedAsset.isNative &&
      !hasPaymentUsdValue &&
      !ethUsdValueRead.error
    ) {
      reasons.push('Checking the ETH/USD price.');
    }

    if (parsedPaymentAmount > 0n && quoteRead.error) {
      reasons.push('The presale quote is unavailable. Refresh and try again.');
    }

    if (parsedPaymentAmount > 0n && selectedAsset.isNative && ethUsdValueRead.error) {
      reasons.push('The ETH/USD price feed is unavailable. Refresh and try again.');
    }

    if (parsedPaymentAmount > 0n && hasPaymentUsdValue && !meetsMinimum) {
      reasons.push(`Minimum purchase is ${formatUsd(minimumPurchaseUsd, 0)}.`);
    }

    if (parsedPaymentAmount > 0n && !hasEnoughBalance) {
      reasons.push(
        `Your ${selectedAsset.symbol} balance is ${formatPaymentAmount(selectedBalance, selectedAsset)}; enter a smaller amount.`
      );
    }

    if (parsedPaymentAmount > 0n && !quoteRead.data && !quoteRead.error) {
      reasons.push('Preparing the presale quote.');
    }

    if (parsedPaymentAmount > 0n && quoteRead.data && !quoteUsesFullAmount) {
      reasons.push('This amount cannot be fully allocated by the presale contract.');
    }

    return reasons;
  }, [
    claimActive,
    ethUsdValueRead.error,
    hasEnoughBalance,
    hasPaymentUsdValue,
    isConnected,
    isOnMainnet,
    meetsMinimum,
    minimumPurchaseUsd,
    parsedPaymentAmount,
    quoteRead.data,
    quoteRead.error,
    quoteUsesFullAmount,
    saleActive,
    salePaused,
    selectedAsset,
    selectedBalance,
  ]);

  const primaryDisabled =
    isSubmittingTransaction ||
    isSwitchingChain ||
    primaryBlockReasons.length > 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!writeError) return;

    setTransactionNotice(mapTransactionErrorToNotice(writeError));

    if (!isUserRejectedError(writeError)) {
      console.error(writeError);
    }
  }, [writeError]);

  useEffect(() => {
    if (!receiptError) return;

    setTransactionNotice(mapTransactionErrorToNotice(receiptError));

    if (!isUserRejectedError(receiptError)) {
      console.error(receiptError);
    }
  }, [receiptError]);

  useEffect(() => {
    if (!transactionNotice && !walletNotice) return undefined;

    const timeout = window.setTimeout(() => {
      setTransactionNotice(null);
      setWalletNotice(null);
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [transactionNotice, walletNotice]);

  useEffect(() => {
    if (!isTransactionConfirmed || !activeTxHash || !txPhase) return;

    if (txPhase === 'approve') {
      setSuccessMessage(`${selectedAsset.symbol} approval confirmed. You can now buy ARMN.`);
      allowanceRead.refetch();
    }

    if (txPhase === 'purchase') {
      setSuccessMessage(`Purchase confirmed. Your ARMN allocation has been refreshed.`);
      setShowEmailCapture(true);
      setPaymentAmount('');
      buyerDashboardRead.refetch();
      saleStatusRead.refetch();
      currentBatchRead.refetch();
      allowanceRead.refetch();
      balanceRead.refetch();
      nativeBalanceRead.refetch();
      ethUsdValueRead.refetch();
    }

    if (txPhase === 'claim') {
      setSuccessMessage('Claim confirmed. Your wallet dashboard has been refreshed.');
      buyerDashboardRead.refetch();
      saleStatusRead.refetch();
    }

    setTxPhase(null);
  }, [
    activeTxHash,
    allowanceRead,
    balanceRead,
    buyerDashboardRead,
    currentBatchRead,
    ethUsdValueRead,
    isTransactionConfirmed,
    nativeBalanceRead,
    saleStatusRead,
    selectedAsset.symbol,
    txPhase,
  ]);

  const handleCopyAddress = async () => {
    if (!address || typeof window === 'undefined' || !navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard support is optional.
    }
  };

  const handleOpenWalletModal = () => {
    setWalletNotice(null);

    if (!openConnectModal) {
      setWalletNotice(
        mapWalletErrorToNotice(
          new Error('Wallet modal unavailable. Check RainbowKit provider setup.')
        )
      );
      return;
    }

    openConnectModal();
  };

  const handleManageWallet = () => {
    if (openAccountModal) {
      openAccountModal();
      return;
    }

    disconnect();
  };

  const handleAddTokenToWallet = async () => {
    setActionMessage('');
    setWalletNotice(null);
    setSuccessMessage('');

    if (!isConnected) {
      handleOpenWalletModal();
      return;
    }

    setIsAddingToken(true);

    try {
      const wasAdded = await watchArtemisToken(connector);

      if (wasAdded) {
        setSuccessMessage('ARMN has been added to your wallet.');
      } else {
        setActionMessage('Token import was cancelled in your wallet.');
      }
    } catch (error) {
      setWalletNotice(
        mapWalletErrorToNotice(
          error instanceof Error
            ? error
            : new Error('Your wallet could not import ARMN automatically.')
        )
      );
    } finally {
      setIsAddingToken(false);
    }
  };

  const refreshReads = () => {
    saleStatusRead.refetch();
    presaleCapRead.refetch();
    minimumPurchaseRead.refetch();
    batchCountRead.refetch();
    currentBatchRead.refetch();
    buyerDashboardRead.refetch();
    allowanceRead.refetch();
    balanceRead.refetch();
    nativeBalanceRead.refetch();
    quoteRead.refetch();
    ethUsdValueRead.refetch();
  };

  const handlePrimaryAction = async () => {
    setActionMessage('');
    setSuccessMessage('');
    setTransactionNotice(null);

    if (!isConnected) {
      handleOpenWalletModal();
      return;
    }

    if (!isOnMainnet) {
      switchChain({ chainId: ARTEMIS_CHAIN.id });
      return;
    }

    if (!saleActive) {
      setActionMessage('The presale contract is not active yet.');
      return;
    }

    if (salePaused) {
      setActionMessage('The presale contract is currently paused.');
      return;
    }

    if (claimActive) {
      setActionMessage('Buying is closed because claims are active.');
      return;
    }

    if (parsedPaymentAmount <= 0n) {
      setActionMessage('Enter a valid contribution amount.');
      return;
    }

    if (!hasPaymentUsdValue) {
      setActionMessage('Checking the ETH/USD price. Try again in a moment.');
      return;
    }

    if (!meetsMinimum) {
      setActionMessage(`Minimum purchase is ${formatUsd(minimumPurchaseUsd, 0)}.`);
      return;
    }

    if (!hasEnoughBalance) {
      setActionMessage(`Insufficient ${selectedAsset.symbol} balance on Ethereum.`);
      return;
    }

    if (!quoteRead.data) {
      setActionMessage('Preparing the presale quote. Try again in a moment.');
      return;
    }

    if (!quoteUsesFullAmount) {
      setActionMessage('This amount exceeds the remaining presale allocation. Use a smaller amount.');
      return;
    }

    try {
      const isApproval = approvalNeeded;
      setTxPhase(isApproval ? 'approve' : 'purchase');

      const hash = await writeContractAsync(
        isApproval
          ? {
              abi: ERC20_APPROVAL_ABI,
              address: selectedAsset.address,
              functionName: 'approve',
              args: [ARTEMIS_CONTRACTS.presale, parsedPaymentAmount],
              chainId: ARTEMIS_CHAIN.id,
            }
          : selectedAsset.isNative
            ? {
                abi: ARTEMIS_PRESALE_ABI,
                address: ARTEMIS_CONTRACTS.presale,
                functionName: selectedAsset.buyFunction,
                value: parsedPaymentAmount,
                chainId: ARTEMIS_CHAIN.id,
              }
          : {
              abi: ARTEMIS_PRESALE_ABI,
              address: ARTEMIS_CONTRACTS.presale,
              functionName: selectedAsset.buyFunction,
              args: [parsedPaymentAmount],
              chainId: ARTEMIS_CHAIN.id,
            }
      );

      setActiveTxHash(hash);
    } catch (error) {
      setTxPhase(null);
      setTransactionNotice(mapTransactionErrorToNotice(error));

      if (!isUserRejectedError(error)) {
        console.error(error);
      }
    }
  };

  const handleClaim = async () => {
    setActionMessage('');
    setSuccessMessage('');
    setTransactionNotice(null);

    if (!isConnected) {
      handleOpenWalletModal();
      return;
    }

    if (!isOnMainnet) {
      switchChain({ chainId: ARTEMIS_CHAIN.id });
      return;
    }

    if (!claimActive || buyerClaimable <= 0n) {
      setActionMessage('There are no ARMN tokens claimable for this wallet yet.');
      return;
    }

    try {
      setTxPhase('claim');
      const hash = await writeContractAsync({
        abi: ARTEMIS_PRESALE_ABI,
        address: ARTEMIS_CONTRACTS.presale,
        functionName: 'claimTokens',
        chainId: ARTEMIS_CHAIN.id,
      });

      setActiveTxHash(hash);
    } catch (error) {
      setTxPhase(null);
      setTransactionNotice(mapTransactionErrorToNotice(error));

      if (!isUserRejectedError(error)) {
        console.error(error);
      }
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setEmailStatus('');
    setIsSavingEmail(true);

    try {
      const response = await fetch('/api/presale-interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email,
          consentToEmail: emailConsent,
          walletAddress: address,
          source: 'presale-success',
          transactionHash: activeTxHash,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Email signup failed');
      }

      setContactName('');
      setEmail('');
      setEmailConsent(false);
      setEmailStatus('Saved for launch updates.');
      window.setTimeout(() => {
        setShowEmailCapture(false);
        setEmailStatus('');
      }, 1200);
    } catch {
      setEmailStatus('Unable to save your details right now.');
    } finally {
      setIsSavingEmail(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11377f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.45),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.32),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(147,197,253,0.2),transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6 md:py-10">
        <header className="mb-8 flex items-center justify-between gap-4 px-0 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10">
              <Rocket className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <div className="text-base font-semibold uppercase tracking-[0.14em] text-blue-50 sm:text-xl sm:tracking-[0.18em]">
                ARTEMIS MOON
              </div>
              <div className="hidden text-[11px] uppercase tracking-[0.3em] text-blue-200/45 sm:block">
                Artemis Moon Network
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="hidden h-12 items-center justify-center rounded-2xl border border-blue-300/30 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 px-5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.28)] transition-all duration-200 hover:from-blue-400 hover:via-sky-300 hover:to-cyan-200 md:inline-flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Mission Control
          </Link>
          <MobileSiteMenu />
        </header>

        <section
          aria-labelledby="presale-heading"
          className="rounded-[2rem] border border-blue-200/20 bg-slate-950/55 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.48)] backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="w-full lg:w-[42%]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Ethereum Mainnet
              </div>
              <h1
                id="presale-heading"
                className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl"
              >
                Secure your ARMN allocation
              </h1>
              <div className="mt-4 text-xl font-medium text-cyan-300 md:text-2xl">
                Batch {Number(currentBatchId) + 1} of {Number(batchCount || 6n)} - {formatUsd(currentPriceUsd)}
              </div>
              <p className="mt-4 text-sm text-blue-100/65 md:text-base">
                Buy ARMN through the deployed Ethereum mainnet presale contract using ETH, USDC, or USDT.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Stat label="Total sold" value={`${formatTokenAmount(totalTokensSold, 0)} ARMN`} />
                <Stat label="Remaining" value={`${formatTokenAmount(totalTokensRemaining, 0)} ARMN`} />
                <Stat label="Raised" value={formatUsd(totalUsdRaised, 0)} />
                <Stat
                  label="Status"
                  value={claimActive ? 'Claims active' : salePaused ? 'Paused' : saleActive ? 'Live' : 'Inactive'}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/15 bg-slate-950/55 p-4 shadow-[0_12px_28px_rgba(2,6,23,0.22)]">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-blue-100/60">Total presale progress</span>
                  <span className="font-medium text-white">{totalSoldPercent.toFixed(2)}% sold</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                    style={{ width: `${Math.min(totalSoldPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/15 bg-slate-950/55 p-4 shadow-[0_12px_28px_rgba(2,6,23,0.22)]">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-blue-100/60">Current batch progress</span>
                  <span className="font-medium text-white">{batchSoldPercent.toFixed(2)}% sold</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-300"
                    style={{ width: `${Math.min(batchSoldPercent, 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-blue-100/45">
                  {formatTokenAmount(batchTokensRemaining, 0)} ARMN remaining in this batch
                </div>
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <div className="rounded-[1.75rem] border border-cyan-200/20 bg-slate-950/65 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.32)]">
                {!isConnected ? (
                  <div>
                    <Button
                      className="h-14 w-full rounded-2xl text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)]"
                      onClick={handleOpenWalletModal}
                      disabled={!isMounted}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </Button>
                    <div className="mt-4 text-center text-sm text-blue-100/60">
                      Choose WalletConnect, MetaMask, or Trust Wallet.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" />
                      <div className="w-full">
                        <div className="font-medium text-emerald-100">
                          {selectedWalletName || 'Wallet'} connected
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <div className="rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1 text-xs text-emerald-100/80">
                            {formatAddress(address)}
                          </div>
                          <div className="rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1 text-xs text-emerald-100/80">
                            {chain?.name || 'Unknown network'}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyAddress}
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1 text-xs text-emerald-100/80 hover:bg-black/30"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {!isOnMainnet && (
                      <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-100" />
                          <div>
                            <div className="font-medium text-amber-100">Ethereum required</div>
                            <div className="mt-1 text-sm text-amber-100/70">
                              Switch your wallet to Ethereum mainnet before continuing.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {acceptedAssets.map((asset) => {
                        const active = selectedAsset.symbol === asset.symbol;
                        return (
                          <button
                            type="button"
                            key={asset.symbol}
                            onClick={() => {
                              setSelectedAssetSymbol(asset.symbol);
                              setActionMessage('');
                              setSuccessMessage('');
                            }}
                            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                              active
                                ? 'border-cyan-300/30 bg-cyan-300/10'
                                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                            }`}
                            aria-pressed={active}
                          >
                            <div className="font-semibold text-white">{asset.label}</div>
                            <div className="mt-1 text-sm text-blue-100/55">Ethereum</div>
                          </button>
                        );
                      })}
                    </div>

                    <NumberInput
                      label="Contribution"
                      value={paymentAmount}
                      onChange={setPaymentAmount}
                      suffix={selectedAsset.symbol}
                      minAmount={minimumPurchaseUsd}
                    />

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-blue-200/45">
                        You receive
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-3xl font-semibold text-white">
                          {formatTokenAmount(quotedTokens)} ARMN
                        </div>
                        <div className="text-sm text-blue-100/55">
                          at {formatUsd(currentPriceUsd)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-100/55">
                        Balance: {formatPaymentAmount(selectedBalance, selectedAsset)} {selectedAsset.symbol}
                      </div>
                      {!selectedAsset.isNative && (
                        <div className="mt-1 text-sm text-blue-100/55">
                          Allowance: {formatPaymentAmount(allowance, selectedAsset)} {selectedAsset.symbol}
                        </div>
                      )}
                      {parsedPaymentAmount > 0n && quoteRead.data && (
                        <div className="mt-1 text-sm text-blue-100/45">
                          Quote batches: {Number(quoteStartBatch) + 1} to {Number(quoteEndBatch) + 1}
                        </div>
                      )}
                    </div>

                    {primaryBlockReasons.length > 0 && (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100/80">
                        <div className="font-medium text-amber-100">Before continuing</div>
                        <ul className="mt-2 space-y-1">
                          {primaryBlockReasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {actionMessage && (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100/80">
                        {actionMessage}
                      </div>
                    )}

                    {walletNotice && (
                      <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100/80">
                        {walletNotice.message}
                      </div>
                    )}

                    {transactionNotice && (
                      <div
                        className={`rounded-2xl p-4 text-sm ${
                          transactionNotice.type === 'warning'
                            ? 'border border-amber-300/20 bg-amber-400/10 text-amber-100/80'
                            : 'border border-red-300/20 bg-red-400/10 text-red-100/80'
                        }`}
                      >
                        {transactionNotice.message}
                      </div>
                    )}

                    {successMessage && (
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100/85">
                        {successMessage}
                      </div>
                    )}

                    {activeTxHash && (
                      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                        <div className="text-sm text-cyan-100/90">Latest transaction</div>
                        <div className="mt-2 break-all text-xs text-cyan-100/70">{activeTxHash}</div>
                        {explorerUrl && (
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm text-cyan-100 hover:underline"
                          >
                            View on Etherscan
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}

                    <Button
                      className="h-14 w-full rounded-2xl text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)]"
                      onClick={handlePrimaryAction}
                      disabled={primaryDisabled}
                    >
                      {isOpeningWallet || isConfirmingTransaction || isSwitchingChain ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isSwitchingChain ? 'Switching network...' : primaryButtonLabel}
                    </Button>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Button
                        variant="outline"
                        className="h-auto min-h-12 min-w-0 rounded-2xl px-3 py-2 font-medium leading-4"
                        onClick={handleManageWallet}
                      >
                        <Wallet className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-center">Manage Wallet</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto min-h-12 min-w-0 rounded-2xl px-3 py-2 font-medium leading-4"
                        onClick={handleAddTokenToWallet}
                        disabled={isAddingToken}
                      >
                        {isAddingToken ? (
                          <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                        ) : (
                          <PlusCircle className="mr-2 h-4 w-4 shrink-0" />
                        )}
                        <span className="text-center">Add ARMN</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto min-h-12 min-w-0 rounded-2xl px-3 py-2 font-medium leading-4"
                        onClick={refreshReads}
                      >
                        <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-center">Refresh</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="my-8">
            <Divider />
          </div>

          <section aria-labelledby="allocation-heading" className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/15 bg-slate-950/55 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.3)]">
              <h2 id="allocation-heading" className="text-xl font-semibold text-white">
                My Artemis Moon Allocation
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Purchased" value={`${formatTokenAmount(buyerTokensAllocated)} ARMN`} />
                <Stat label="Contributed" value={formatUsd(buyerUsdSpent)} />
                <Stat label="Claimed" value={`${formatTokenAmount(buyerTokensClaimed)} ARMN`} />
                <Stat label="Purchases" value={String(buyerPurchaseCount)} />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-blue-200/45">
                      Claimable
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {formatTokenAmount(buyerClaimable)} ARMN
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl px-5 font-medium"
                    onClick={handleClaim}
                    disabled={!claimActive || buyerClaimable <= 0n || isSubmittingTransaction}
                  >
                    {txPhase === 'claim' && isConfirmingTransaction ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Claim ARMN
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-cyan-200/20 bg-slate-950/65 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.32)]">
              <h2 className="text-xl font-semibold text-white">Contract Details</h2>
              <div className="mt-4 space-y-4 text-sm">
                {[
                  ['Presale contract', ARTEMIS_CONTRACTS.presale],
                  ['ARMN token', ARTEMIS_CONTRACTS.token],
                  ['Team lock', ARTEMIS_CONTRACTS.teamLock],
                ].map(([label, contractAddress]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs font-medium uppercase tracking-[0.16em] text-blue-100/55">
                      {label}
                    </div>
                    <a
                      href={`${ARTEMIS_EXPLORER_ADDRESS_BASE}/${contractAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block break-all font-mono text-xs leading-5 text-cyan-100 hover:text-white hover:underline"
                    >
                      {contractAddress}
                    </a>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-blue-100/55">Claims</span>
                  <span className="font-medium text-white">{claimActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </section>

          {showEmailCapture && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="launch-updates-heading"
                className="w-full max-w-md rounded-[1.75rem] border border-cyan-300/20 bg-[#07111f] p-5 shadow-[0_0_80px_rgba(34,211,238,0.16)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h2 id="launch-updates-heading" className="mt-4 text-2xl font-semibold text-white">
                      Stay close to launch
                    </h2>
                    <p className="mt-2 text-sm text-blue-100/60">
                      Get launch updates and claim reminders for this wallet.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-blue-100/70 hover:bg-white/5"
                    aria-label="Close launch updates form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3">
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    placeholder="Name"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-blue-100/35"
                  />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-blue-100/35"
                />

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-blue-100/70">
                    <input
                      type="checkbox"
                      required
                      checked={emailConsent}
                      onChange={(event) => setEmailConsent(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-cyan-300"
                    />
                    <span>
                      I agree to receive Artemis Moon launch updates, claim reminders, and project news
                      for this wallet.
                    </span>
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-blue-100/45">
                    Wallet: {formatAddress(address)}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-2xl font-medium"
                      onClick={() => setShowEmailCapture(false)}
                    >
                      Skip
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 rounded-2xl px-5 font-medium"
                      disabled={isSavingEmail}
                    >
                      {isSavingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
              </form>
              {emailStatus && (
                <div className="mt-3 text-sm text-cyan-100/80">{emailStatus}</div>
              )}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function __testables() {
  return {
    formatAddress,
    normaliseConnectorName,
    safeParsePaymentAmount,
    formatTokenAmount,
    formatStableAmount,
    formatPaymentAmount,
    percentage,
  };
}
