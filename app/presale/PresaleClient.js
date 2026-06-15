'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useAccount,
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
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';

import {
  ARTEMIS_CHAIN,
  ARTEMIS_EXPLORER_TX_BASE,
  ARTEMIS_PRESALE_ABI,
  ARTEMIS_SEPOLIA_CONTRACTS,
  ERC20_APPROVAL_ABI,
} from '@/lib/web3/artemisContracts';
import {
  isUserRejectedError,
  mapTransactionErrorToNotice,
  mapWalletErrorToNotice,
} from '@/lib/web3/errors';

const TOKEN_DECIMALS = 18;
const STABLE_DECIMALS = 6;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const acceptedAssets = [
  {
    symbol: 'USDC',
    label: 'USDC',
    address: ARTEMIS_SEPOLIA_CONTRACTS.usdc,
    buyFunction: 'buyWithUSDC',
    quoteFunction: 'quoteForUSDC',
  },
  {
    symbol: 'USDT',
    label: 'USDT',
    address: ARTEMIS_SEPOLIA_CONTRACTS.usdt,
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

function safeParseStableAmount(value) {
  const normalized = String(value || '').trim().replace(',', '.');

  if (!normalized || !/^\d+(\.\d{0,6})?$/.test(normalized)) {
    return 0n;
  }

  try {
    return parseUnits(normalized, STABLE_DECIMALS);
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-blue-200/45">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export default function ArtemisPresalePage() {
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState('USDC');
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
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

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
    () => safeParseStableAmount(paymentAmount),
    [paymentAmount]
  );

  const saleStatusRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
    functionName: 'getSaleStatus',
    chainId: ARTEMIS_CHAIN.id,
    query: {
      refetchInterval: 15000,
    },
  });

  const presaleCapRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
    functionName: 'presaleTokenCap',
    chainId: ARTEMIS_CHAIN.id,
  });

  const minimumPurchaseRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
    functionName: 'minimumPurchaseUsd',
    chainId: ARTEMIS_CHAIN.id,
  });

  const batchCountRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
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
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
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
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
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
    address: selectedAsset.address,
    functionName: 'allowance',
    args: [address || ZERO_ADDRESS, ARTEMIS_SEPOLIA_CONTRACTS.presale],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address),
      refetchInterval: 15000,
    },
  });

  const balanceRead = useReadContract({
    abi: ERC20_APPROVAL_ABI,
    address: selectedAsset.address,
    functionName: 'balanceOf',
    args: [address || ZERO_ADDRESS],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: Boolean(isConnected && address),
      refetchInterval: 15000,
    },
  });

  const quoteRead = useReadContract({
    abi: ARTEMIS_PRESALE_ABI,
    address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
    functionName: selectedAsset.quoteFunction,
    args: [parsedPaymentAmount],
    chainId: ARTEMIS_CHAIN.id,
    query: {
      enabled: parsedPaymentAmount > 0n,
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
  const isOnSepolia = chain?.id === ARTEMIS_CHAIN.id;
  const allowance = allowanceRead.data || 0n;
  const selectedBalance = balanceRead.data || 0n;
  const approvalNeeded = parsedPaymentAmount > 0n && allowance < parsedPaymentAmount;
  const meetsMinimum =
    parsedPaymentAmount > 0n && (!minimumPurchaseUsd || parsedPaymentAmount >= minimumPurchaseUsd);
  const hasEnoughBalance = selectedBalance >= parsedPaymentAmount;
  const quoteUsdUsed = structValue(quoteRead.data, 0, 'usdUsed', 0n);
  const quotedTokens = structValue(quoteRead.data, 1, 'tokensAllocated', 0n);
  const quoteStartBatch = structValue(quoteRead.data, 2, 'startBatchId', currentBatchId);
  const quoteEndBatch = structValue(quoteRead.data, 3, 'endBatchId', currentBatchId);
  const quoteUsesFullAmount = parsedPaymentAmount === 0n || quoteUsdUsed === parsedPaymentAmount;

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
    if (!isOnSepolia) return 'Switch to Sepolia';
    if (isOpeningWallet) return 'Opening wallet...';
    if (isConfirmingTransaction) return txPhase === 'approve' ? 'Confirming approval...' : 'Confirming transaction...';
    if (claimActive) return 'Buying closed - claims active';
    if (parsedPaymentAmount <= 0n) return 'Enter contribution amount';
    if (approvalNeeded) return `Approve ${selectedAsset.symbol}`;
    return `Buy ARTM3 with ${selectedAsset.symbol}`;
  }, [
    approvalNeeded,
    claimActive,
    isConnected,
    isConfirmingTransaction,
    isOnSepolia,
    isOpeningWallet,
    parsedPaymentAmount,
    selectedAsset.symbol,
    txPhase,
  ]);

  const primaryBlockReasons = useMemo(() => {
    if (!isConnected || !isOnSepolia) return [];

    const reasons = [];

    if (!saleActive) {
      reasons.push('The presale contract is not active.');
    }

    if (salePaused) {
      reasons.push('The presale contract is paused.');
    }

    if (claimActive) {
      reasons.push('Buying is closed because claims are active on this Sepolia contract.');
    }

    if (parsedPaymentAmount <= 0n) {
      reasons.push('Enter a contribution amount.');
    }

    if (parsedPaymentAmount > 0n && !meetsMinimum) {
      reasons.push(`Minimum purchase is ${formatUsd(minimumPurchaseUsd, 0)}.`);
    }

    if (parsedPaymentAmount > 0n && !hasEnoughBalance) {
      reasons.push(
        `Your ${selectedAsset.symbol} balance is ${formatStableAmount(selectedBalance)}; enter a smaller amount.`
      );
    }

    if (parsedPaymentAmount > 0n && quoteRead.data && !quoteUsesFullAmount) {
      reasons.push('This amount cannot be fully allocated by the presale contract.');
    }

    return reasons;
  }, [
    claimActive,
    hasEnoughBalance,
    isConnected,
    isOnSepolia,
    meetsMinimum,
    minimumPurchaseUsd,
    parsedPaymentAmount,
    quoteRead.data,
    quoteUsesFullAmount,
    saleActive,
    salePaused,
    selectedAsset.symbol,
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
      setSuccessMessage(`${selectedAsset.symbol} approval confirmed. You can now buy ARTM3.`);
      allowanceRead.refetch();
    }

    if (txPhase === 'purchase') {
      setSuccessMessage(`Purchase confirmed. Your ARTM3 allocation has been refreshed.`);
      setShowEmailCapture(true);
      setPaymentAmount('');
      buyerDashboardRead.refetch();
      saleStatusRead.refetch();
      currentBatchRead.refetch();
      allowanceRead.refetch();
      balanceRead.refetch();
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
    isTransactionConfirmed,
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

  const refreshReads = () => {
    saleStatusRead.refetch();
    presaleCapRead.refetch();
    minimumPurchaseRead.refetch();
    batchCountRead.refetch();
    currentBatchRead.refetch();
    buyerDashboardRead.refetch();
    allowanceRead.refetch();
    balanceRead.refetch();
    quoteRead.refetch();
  };

  const handlePrimaryAction = async () => {
    setActionMessage('');
    setSuccessMessage('');
    setTransactionNotice(null);

    if (!isConnected) {
      handleOpenWalletModal();
      return;
    }

    if (!isOnSepolia) {
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

    if (!meetsMinimum) {
      setActionMessage(`Minimum purchase is ${formatUsd(minimumPurchaseUsd, 0)}.`);
      return;
    }

    if (!hasEnoughBalance) {
      setActionMessage(`Insufficient ${selectedAsset.symbol} balance on Sepolia.`);
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
              args: [ARTEMIS_SEPOLIA_CONTRACTS.presale, parsedPaymentAmount],
              chainId: ARTEMIS_CHAIN.id,
            }
          : {
              abi: ARTEMIS_PRESALE_ABI,
              address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
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

    if (!isOnSepolia) {
      switchChain({ chainId: ARTEMIS_CHAIN.id });
      return;
    }

    if (!claimActive || buyerClaimable <= 0n) {
      setActionMessage('There are no ARTM3 tokens claimable for this wallet yet.');
      return;
    }

    try {
      setTxPhase('claim');
      const hash = await writeContractAsync({
        abi: ARTEMIS_PRESALE_ABI,
        address: ARTEMIS_SEPOLIA_CONTRACTS.presale,
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

    try {
      const response = await fetch('/api/presale-interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          walletAddress: address,
          source: 'presale-success',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Email signup failed');
      }

      setEmail('');
      setEmailStatus('Saved for launch updates.');
    } catch {
      setEmailStatus('Unable to save email right now.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.28),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.12),transparent_28%)]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6 md:py-10">
        <header className="mb-8 flex items-center justify-between gap-4 px-0 py-2">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <span className="text-xl font-semibold text-cyan-200">A3</span>
            </div>

            <div className="leading-tight">
              <div className="text-xl font-semibold tracking-[0.2em] text-white">
                ARTEMIS
              </div>
              <div className="text-xs tracking-[0.35em] text-blue-300/60">
                SEPOLIA PRESALE TEST
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm text-blue-100 transition-all duration-200 hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Mission Control
          </Link>
        </header>

        <section
          aria-labelledby="presale-heading"
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_80px_rgba(37,99,235,0.08)] backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="w-full lg:w-[42%]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Ethereum Sepolia
              </div>
              <h1
                id="presale-heading"
                className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl"
              >
                Secure your ARTM3 allocation
              </h1>
              <div className="mt-4 text-xl font-medium text-cyan-300 md:text-2xl">
                Batch {Number(currentBatchId) + 1} of {Number(batchCount || 6n)} - {formatUsd(currentPriceUsd)}
              </div>
              <p className="mt-4 text-sm text-blue-100/65 md:text-base">
                Buy ARTM3 through the deployed Sepolia presale contract using test USDC or test USDT.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Stat label="Total sold" value={`${formatTokenAmount(totalTokensSold, 0)} ARTM3`} />
                <Stat label="Remaining" value={`${formatTokenAmount(totalTokensRemaining, 0)} ARTM3`} />
                <Stat label="Raised" value={formatUsd(totalUsdRaised, 0)} />
                <Stat
                  label="Status"
                  value={claimActive ? 'Claims active' : salePaused ? 'Paused' : saleActive ? 'Live' : 'Inactive'}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
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

              <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
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
                  {formatTokenAmount(batchTokensRemaining, 0)} ARTM3 remaining in this batch
                </div>
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
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
                      Choose MetaMask, WalletConnect, or Coinbase Wallet.
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

                    {!isOnSepolia && (
                      <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-100" />
                          <div>
                            <div className="font-medium text-amber-100">Sepolia required</div>
                            <div className="mt-1 text-sm text-amber-100/70">
                              Switch your wallet to Sepolia before testing the presale.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
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
                            <div className="mt-1 text-sm text-blue-100/55">Sepolia</div>
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
                          {formatTokenAmount(quotedTokens)} ARTM3
                        </div>
                        <div className="text-sm text-blue-100/55">
                          at {formatUsd(currentPriceUsd)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-100/55">
                        Balance: {formatStableAmount(selectedBalance)} {selectedAsset.symbol}
                      </div>
                      <div className="mt-1 text-sm text-blue-100/55">
                        Allowance: {formatStableAmount(allowance)} {selectedAsset.symbol}
                      </div>
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
                            View on Sepolia Etherscan
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

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 rounded-2xl font-medium"
                        onClick={handleManageWallet}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 rounded-2xl font-medium"
                        onClick={refreshReads}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
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
            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
              <h2 id="allocation-heading" className="text-xl font-semibold text-white">
                My Artemis Allocation
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Purchased" value={`${formatTokenAmount(buyerTokensAllocated)} ARTM3`} />
                <Stat label="Contributed" value={formatUsd(buyerUsdSpent)} />
                <Stat label="Claimed" value={`${formatTokenAmount(buyerTokensClaimed)} ARTM3`} />
                <Stat label="Purchases" value={String(buyerPurchaseCount)} />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-blue-200/45">
                      Claimable
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {formatTokenAmount(buyerClaimable)} ARTM3
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
                    Claim ARTM3
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
              <h2 className="text-xl font-semibold text-white">Contract Details</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-blue-100/55">Presale</span>
                  <span className="font-medium text-white">{formatAddress(ARTEMIS_SEPOLIA_CONTRACTS.presale)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-blue-100/55">Token</span>
                  <span className="font-medium text-white">{formatAddress(ARTEMIS_SEPOLIA_CONTRACTS.token)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-blue-100/55">Claims</span>
                  <span className="font-medium text-white">{claimActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </section>

          {showEmailCapture && (
            <section className="mt-5 rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <h2 className="text-xl font-semibold text-white">Stay close to launch</h2>
              <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email for claim reminders"
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-blue-100/35"
                />
                <Button type="submit" className="h-12 rounded-2xl px-5 font-medium">
                  Save Email
                </Button>
              </form>
              {emailStatus && (
                <div className="mt-3 text-sm text-cyan-100/80">{emailStatus}</div>
              )}
            </section>
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
    safeParseStableAmount,
    formatTokenAmount,
    formatStableAmount,
    percentage,
  };
}
