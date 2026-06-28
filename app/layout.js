import './globals.css';
import Providers from './providers';

const siteUrl = 'https://artemismoon.io';

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Artemis Moon ($ARMN) | Ethereum Coin Presale',
    template: '%s | artemismoon.io',
  },

  description:
    'Artemis Moon ($ARMN) is a mission-agnostic lunar token for the Artemis era, with a fixed 10M supply and ETH, USDT, and USDC presale support.',

  verification: {
    google: '8-TC18_G7qkTSam-Ccvk0CudU68lL4Qv4cu2na_VVM8',
  },

  applicationName: 'Artemis Moon',

  icons: {
    icon: [
      {
        url: '/artemis-moon-icon.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      },
    ],
    shortcut: ['/artemis-moon-icon.svg'],
  },

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Artemis Moon',
    title: 'Artemis Moon - $ARMN',
    description:
      'A mission-agnostic lunar token for the Artemis era.',
    images: [
      {
        url: `${siteUrl}/images/calculator/private-rocket.png`,
        width: 1024,
        height: 1024,
        alt: 'A private rocket launching through a starry sky',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Artemis Moon - $ARMN',
    description:
      'A community token for the Artemis era of lunar exploration.',
    images: [`${siteUrl}/images/calculator/private-rocket.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is Artemis Moon?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Artemis Moon is an Ethereum-based coin with a fixed supply of 10,000,000 ARMN tokens. It is designed as a mission-agnostic lunar token for the wider Artemis era of lunar exploration."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I buy $ARMN?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When the presale is activated, buyers can connect a crypto wallet and pay with ETH, USDT or USDC on Ethereum mainnet."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which network does Artemis Moon use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Artemis Moon is built on the Ethereum network, allowing buyers to use widely supported wallets such as MetaMask and WalletConnect."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the total supply of $ARMN?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The total supply is fixed at 10,000,000 ARMN tokens, with no inflation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the presale structure?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The presale is divided into multiple batches, with pricing increasing from $0.25 to $0.90. Early buyers receive the lowest entry prices."
                  }
                },
                {
                  "@type": "Question",
                  "name": "When does the presale end?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Artemis Moon presale is scheduled to end on 31 March 2027, after which final allocations will be locked ahead of the launch."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the expected launch price?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The target listing price for Artemis Moon is $1.00, aligned with the broader launch strategy and exchange ambitions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will Artemis Moon be listed on exchanges?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The project is targeting a Tier 1 exchange listing, with timing aligned to wider Artemis-era lunar exploration attention. This is an objective, not a guarantee."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is liquidity locked?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No liquidity position has been created yet. Artemis Moon intends to publish any future liquidity arrangement and lock evidence before trading begins."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need a crypto wallet to participate?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you need a compatible crypto wallet such as MetaMask to connect and purchase ARMN during the presale."
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
