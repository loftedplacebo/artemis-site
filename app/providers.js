'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useState } from 'react';

const projectId = 'f97f0ce6825ed5d6b483e58673941832';
const chains = [mainnet];

const config = getDefaultConfig({
  appName: 'Artemis',
  projectId,
  chains,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [walletConnectWallet, metaMaskWallet, trustWallet],
    },
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#3b82f6',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
