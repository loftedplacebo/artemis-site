import CalculatorClient from './CalculatorClient';

export const metadata = {
  title: 'Artemis Moon ARMN Calculator',
  description:
    'Explore illustrative Artemis Moon ARMN presale batch and future-price scenarios. This calculator is for information and entertainment only.',
  alternates: {
    canonical: '/calculator',
  },
  openGraph: {
    type: 'website',
    url: '/calculator',
    title: 'Artemis Moon ARMN Calculator',
    description:
      'Explore illustrative Artemis Moon ARMN presale batch and future-price scenarios from the $1 target to the $10 Moon scenario.',
    images: [
      {
        url: '/images/calculator/private-rocket.png',
        width: 1024,
        height: 1024,
        alt: 'A private rocket launching through a starry sky',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artemis Moon ARMN Calculator',
    description:
      'Explore illustrative Artemis Moon ARMN presale batch and future-price scenarios from the $1 target to the $10 Moon scenario.',
    images: ['/images/calculator/private-rocket.png'],
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
