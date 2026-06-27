import PresaleClient from './PresaleClient';

export const metadata = {
  title: 'Buy $ARMN | Artemis Moon Presale | Ethereum Coin',
  description:
    'Buy $ARMN in the Artemis Moon presale. Connect your wallet and purchase using ETH, USDT or USDC on the Ethereum network before the planned exchange launch.',
  alternates: {
    canonical: '/presale',
  },
};

export default function PresalePage() {
  return <PresaleClient />;
}
