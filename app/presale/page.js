import PresaleClient from './PresaleClient';

export const metadata = {
  title: 'Buy $ARTM3 | Artemis Presale | Ethereum Coin',
  description:
    'Buy $ARTM3 in the Artemis presale. Connect your wallet and purchase using ETH, USDT or USDC on the Ethereum network before the planned exchange launch.',
  alternates: {
    canonical: '/presale',
  },
};

export default function PresalePage() {
  return <PresaleClient />;
}
