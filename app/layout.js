import './globals.css';
import Providers from './providers';

const siteUrl = 'https://artemis3.io';

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Artemis ($ARTM3) | Ethereum Coin Presale',
    template: '%s | Artemis3.io',
  },

  description:
    'Buy Artemis ($ARTM3), an Ethereum-based coin with a fixed 10M supply. Join the live crypto presale using ETH, USDT or USDC before the planned exchange launch.',

  verification: {
    google: '8-TC18_G7qkTSam-Ccvk0CudU68lL4Qv4cu2na_VVM8',
  },

  applicationName: 'Artemis',

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
    siteName: 'Artemis',
    title: 'Artemis ($ARTM3) | Ethereum Coin Presale',
    description:
      'Buy $ARTM3 in the live Ethereum presale. Fixed 10M supply, staged pricing and a launch aligned with the Artemis III Moon mission.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Artemis ($ARTM3) | Ethereum Coin Presale',
    description:
      'Buy $ARTM3 in the live Ethereum presale using ETH, USDT or USDC. Fixed supply, staged pricing and a Tier 1 exchange ambition.',
    images: [`${siteUrl}/og-image.png`],
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
                  "name": "What is Artemis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Artemis is an Ethereum-based coin with a fixed supply of 10,000,000 ARTM3 tokens. The project is designed around the Artemis III Moon mission, combining a real-world narrative with a structured crypto presale and exchange launch strategy."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I buy $ARTM3?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can buy $ARTM3 through the live presale by connecting a crypto wallet and paying with ETH, USDT or USDC on the Ethereum network."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which network does Artemis use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Artemis is built on the Ethereum network, allowing buyers to use widely supported wallets such as MetaMask and WalletConnect."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the total supply of $ARTM3?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The total supply is fixed at 10,000,000 ARTM3 tokens, with no inflation."
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
                    "text": "The Artemis presale is scheduled to end on 31 March 2027, after which final allocations will be locked ahead of the launch."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the expected launch price?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The target listing price for Artemis is $1.00, aligned with the broader launch strategy and exchange ambitions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will Artemis be listed on exchanges?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The project is targeting a Tier 1 exchange listing, with timing aligned to the Artemis III mission for maximum visibility."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is liquidity locked?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, liquidity is planned to be locked at launch to ensure transparency and trust."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need a crypto wallet to participate?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you need a compatible crypto wallet such as MetaMask to connect and purchase ARTM3 during the presale."
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
