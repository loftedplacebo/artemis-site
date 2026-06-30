import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Info,
  Rocket,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import {
  ARTEMIS_CONTRACTS,
  ARTEMIS_EXPLORER_ADDRESS_BASE,
} from '@/lib/web3/artemisContracts';
import MobileSiteMenu from '../components/MobileSiteMenu';

const allocationRows = [
  ['Presale', '5,000,000 ARMN', '50%', 'Allocated through the verified presale contract.'],
  ['Liquidity', '2,000,000 ARMN', '20%', 'Planned for launch; no liquidity position is currently created or locked.'],
  ['Growth fund', '1,500,000 ARMN', '15%', 'Treasury-controlled reserve for future ecosystem activity.'],
  ['Treasury', '1,000,000 ARMN', '10%', 'Treasury-controlled reserve for operations and long-term project needs.'],
  ['Team', '500,000 ARMN', '5%', 'Locked onchain until 1 January 2029 at 00:00 UTC.'],
];

const risks = [
  ['Loss risk', 'ARMN can lose all value. Buyers should only use funds they can afford to lose.'],
  ['No listing promise', 'An exchange listing, including any Tier 1 listing, is an objective rather than a guarantee.'],
  ['Liquidity risk', 'No liquidity pool is currently created or locked. Future liquidity, market depth, and trading availability are uncertain.'],
  ['Utility delivery risk', 'Merchandise, digital assets, collectibles, and marketplace features are roadmap concepts and may change, be delayed, or never be delivered.'],
  ['Technology risk', 'Wallet, smart-contract, oracle, network, phishing, and third-party infrastructure failures can affect holders.'],
  ['Regulatory and tax risk', 'Rules, classifications, restrictions, and tax treatment vary by jurisdiction and can change.'],
];

const contractRows = [
  ['ARMN token', ARTEMIS_CONTRACTS.token, 'Fixed 10,000,000 supply; no post-deployment mint function.'],
  ['Presale contract', ARTEMIS_CONTRACTS.presale, 'ETH, USDT, and USDC support. Sale and claims are currently inactive.'],
  ['Team lock', ARTEMIS_CONTRACTS.teamLock, 'Holds 500,000 ARMN; full release cannot occur before 1 January 2029 UTC.'],
];

function AddressLink({ address }) {
  return (
    <a
      href={`${ARTEMIS_EXPLORER_ADDRESS_BASE}/${address}#code`}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-[260px] items-start gap-1 font-mono text-[11px] leading-5 text-cyan-200 hover:text-white hover:underline"
    >
      <span className="break-all">{address}</span>
      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-white/10 py-10 first:border-t-0 first:pt-0">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/60">{eyebrow}</div>
      <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
      <div className="mt-5 text-[15px] leading-7 text-blue-100/75">{children}</div>
    </section>
  );
}

export const metadata = {
  title: 'Artemis Moon ARMN Whitepaper',
  description: 'Artemis Moon ARMN: a fixed-supply Ethereum coin built as a mission-agnostic lunar token for the Artemis era.',
  alternates: {
    canonical: '/whitepaper',
  },
  openGraph: {
    type: 'article',
    url: '/whitepaper',
    title: 'Artemis Moon ARMN Whitepaper',
    description: 'A transparent overview of Artemis Moon ARMN, its fixed supply, verified Ethereum contracts, tokenomics, and lunar-era community vision.',
    images: [
      {
        url: '/images/calculator/moon-rock.png',
        width: 1024,
        height: 1024,
        alt: 'A glowing Moon rock on a display plinth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artemis Moon ARMN Whitepaper',
    description: 'Explore the fixed supply, verified Ethereum contracts, tokenomics, and Artemis-era vision behind ARMN.',
    images: ['/images/calculator/moon-rock.png'],
  },
};

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#050914] text-white">
      <div className="relative overflow-hidden border-b border-blue-400/20 bg-[#11377f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.45),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.32),transparent_42%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10">
              <Rocket className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="text-base font-semibold uppercase tracking-[0.14em] text-blue-50 sm:text-lg sm:tracking-[0.18em] md:text-xl">
                Artemis Moon
              </div>
              <div className="hidden text-[11px] uppercase tracking-[0.3em] text-blue-200/45 sm:block">
                Artemis Moon Network
              </div>
            </div>
          </Link>
          <div className="hidden w-full items-center gap-3 md:flex md:w-auto">
            <Link
              href="/"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-blue-400/20 bg-black/20 px-3 text-sm text-blue-100 transition hover:bg-blue-500/10 hover:border-blue-300/40 sm:flex-none sm:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Mission Control
            </Link>
            <Link
              href="/presale"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-blue-400/40 bg-blue-500/10 px-3 text-sm font-semibold text-blue-100 shadow-inner transition hover:bg-blue-500/20 hover:border-blue-300/60 sm:flex-none sm:px-5"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Buy $ARMN
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-3 md:hidden">
            <Link
              href="/presale"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-400/40 bg-blue-500/10 px-3 text-sm font-semibold text-blue-100 shadow-inner transition hover:bg-blue-500/20 hover:border-blue-300/60"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Buy
            </Link>
            <MobileSiteMenu />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:py-16">
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-3 text-sm text-blue-100/55">
            {[
              ['Summary', 'summary'],
              ['Project', 'project'],
              ['Technology', 'technology'],
              ['Tokenomics', 'tokenomics'],
              ['Roadmap', 'roadmap'],
              ['Risks', 'risks'],
              ['Disclosure', 'disclosure'],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="block hover:text-cyan-100">
                {label}
              </a>
            ))}
          </div>
        </aside>

        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-cyan-200/65">
            <span>Artemis Moon / ARMN</span>
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            <span>Whitepaper</span>
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            <span>23 June 2026</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            A lunar token built to outlast any single mission.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100/75">
            ARMN is a fixed-supply Ethereum coin created for the broader Artemis era: humanity&apos;s return to
            the Moon, the missions that follow, and the culture that gathers around them. It combines a transparent
            onchain foundation with a long-term ambition to power a space-minded community, merchandise, digital
            collectibles, and future marketplace experiences.
          </p>

          <div className="mt-8 border-l-2 border-cyan-300 bg-cyan-300/10 px-5 py-4 text-sm leading-6 text-cyan-50/90">
            <div className="flex items-center gap-2 font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Built for momentum, grounded in transparency
            </div>
            <p className="mt-2">
              ARMN is designed to be easy to verify, not just easy to talk about. Its fixed supply, token allocation,
              team lock, and contract code are public on Ethereum and independently viewable through Etherscan. This
              whitepaper makes the project&apos;s foundations, ambitions, and risks clear, so the community can follow the
              mission with eyes open.
            </p>
          </div>

          <Section id="summary" eyebrow="01 / Executive summary" title="A lunar-era token, built to last">
            <p>
              ARMN is an ERC-20 coin on Ethereum with a fixed maximum supply of 10,000,000 tokens. It is designed
              around the attention and optimism surrounding the wider Artemis era of lunar exploration, rather than
              depending on one mission number or schedule. A finite supply gives the project a clear, easily verifiable
              foundation: no additional ARMN can be minted under the deployed token contract.
            </p>
            <p className="mt-4">
              The ambition is to meet this global Moon moment with a transparent community coin, then build reasons for
              that community to stay involved beyond a single launch window. Artemis Moon aims to pursue exchange and
              liquidity opportunities around that period, but holding ARMN does not guarantee a listing, price,
              liquidity, return, or access to future products.
            </p>
          </Section>

          <Section id="project" eyebrow="02 / Project and intended utility" title="From Moon moment to Moon economy">
            <p>
              Artemis Moon starts with a simple idea: humanity&apos;s return to the Moon will give people everywhere a reason to look up. ARMN
              is intended to give that attention an onchain home. Over time, the project aims to explore ARMN as a
              community, access, and settlement layer for space-themed merchandise, digital assets, memorabilia, and
              a future marketplace.
            </p>
            <p className="mt-4">
              The Moon is both the inspiration and the challenge: build something that earns attention today and
              usefulness over time. The project is not affiliated with, endorsed by, or sponsored by NASA, the Artemis
              programme, or any government space agency. Marketplace, merchandise, and partnership concepts remain future
              objectives, dependent on execution, demand, resources, and applicable rules.
            </p>
          </Section>

          <Section id="technology" eyebrow="03 / Technology and transparency" title="Built on Ethereum. Open by design.">
            <p>
              ARMN is issued on Ethereum using a standard ERC-20 implementation. Ethereum is an established smart-
              contract network with broad wallet, explorer, and tooling support. The deployed contract source is
              verified on Etherscan, so token supply, balances, presale configuration, and team-lock conditions can
              be independently inspected.
            </p>
            <div className="mt-6 overflow-x-auto border border-white/10">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-blue-100/55">
                  <tr>
                    <th className="px-4 py-3 font-medium">Contract</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Verified fact</th>
                  </tr>
                </thead>
                <tbody>
                  {contractRows.map(([label, address, detail]) => (
                    <tr key={address} className="border-t border-white/10 align-top">
                      <td className="px-4 py-4 font-medium text-white">{label}</td>
                      <td className="px-4 py-4"><AddressLink address={address} /></td>
                      <td className="px-4 py-4 text-blue-100/65">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-blue-100/55">
              The presale accepts ETH, USDT, and USDC. ETH pricing is read onchain from a Chainlink ETH/USD feed;
              the contract rejects invalid or stale price-feed data. The live sale status is the contract state,
              not website marketing copy.
            </p>
          </Section>

          <Section id="tokenomics" eyebrow="04 / Tokenomics" title="A finite supply for a long horizon">
            <p>
              There will only ever be 10,000,000 ARMN. That hard ceiling gives the community a clear supply story and
              lets anyone inspect how the coin is allocated. The allocation below shows where every token is intended
              to sit: a substantial public presale allocation, a planned liquidity reserve, long-term growth capacity,
              and a team allocation already locked onchain.
            </p>
            <p className="mt-4 text-sm text-blue-100/60">
              Fixed supply does not itself create demand, liquidity, or value. It does make the supply rules public and
              enforceable through the deployed contract.
            </p>
            <div className="mt-6 overflow-x-auto border border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-blue-100/55">
                  <tr>
                    <th className="px-4 py-3 font-medium">Allocation</th>
                    <th className="px-4 py-3 font-medium">Tokens</th>
                    <th className="px-4 py-3 font-medium">Share</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocationRows.map(([label, tokens, share, status]) => (
                    <tr key={label} className="border-t border-white/10 align-top">
                      <td className="px-4 py-4 font-medium text-white">{label}</td>
                      <td className="px-4 py-4 text-cyan-100">{tokens}</td>
                      <td className="px-4 py-4 text-blue-100/70">{share}</td>
                      <td className="px-4 py-4 text-blue-100/65">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm leading-6 text-emerald-50/85">
                <div className="flex items-center gap-2 font-semibold text-emerald-100"><CheckCircle2 className="h-4 w-4" /> Team lock is funded</div>
                <p className="mt-2">The full 500,000 ARMN team allocation is held by the verified team-lock contract and cannot be released before 1 January 2029 at 00:00 UTC.</p>
              </div>
              <div className="border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-50/85">
                <div className="flex items-center gap-2 font-semibold text-amber-100"><Info className="h-4 w-4" /> Liquidity remains planned</div>
                <p className="mt-2">No liquidity pool has been created or locked. Any future pool and lock arrangement must be published with its onchain proof before trading begins.</p>
              </div>
            </div>
          </Section>

          <Section id="roadmap" eyebrow="05 / Roadmap and operations" title="Countdown to a bigger mission">
            <ol className="space-y-4 border-l border-cyan-300/25 pl-5">
              <li><strong className="text-white">Foundations live:</strong> token, presale, and funded team lock are deployed; the source code is verified on Etherscan for anyone to inspect.</li>
              <li><strong className="text-white">Launch readiness:</strong> complete the operational, legal, and issuer information needed before opening any relevant public offer.</li>
              <li><strong className="text-white">Presale:</strong> activate the onchain sale when the project is ready, giving the first community members a transparent route to ARMN allocation.</li>
              <li><strong className="text-white">Artemis era:</strong> pursue exchange and liquidity opportunities as lunar exploration draws global attention to the Moon. These are commercial objectives, not commitments.</li>
              <li><strong className="text-white">Beyond the landing:</strong> test and develop the merchandise, collectible, and marketplace ideas that can make ARMN useful to a durable space-minded community.</li>
            </ol>
          </Section>

          <Section id="risks" eyebrow="06 / Material risks" title="Read before acquiring ARMN">
            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
              {risks.map(([title, detail]) => (
                <div key={title} className="bg-[#050914] p-5">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/65">{detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="disclosure" eyebrow="07 / Responsible disclosure" title="Excitement works better with trust">
            <p>
              Artemis Moon is designed to communicate ambition without treating ambition as certainty. Regulation (EU)
              2023/1114 (MiCA) sets disclosure and notification requirements for many EU crypto-asset public offers.
              Before any relevant EU offer, this paper will be completed with the final issuer, offer, rights,
              complaints, and sustainability information required for the circumstances.
            </p>
            <div className="mt-6 border border-white/10 p-5 text-sm leading-6 text-blue-100/70">
              <h3 className="font-semibold text-white">What will be added before a relevant EU public offer</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Final issuer identity, contact details, relevant jurisdictions, and offer terms.</li>
                <li>Rights and obligations, complaints process, conflicts information, and sustainability disclosures.</li>
                <li>Legal review, required notification and publication steps, and translations where applicable.</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <a className="inline-flex items-center gap-2 text-cyan-200 hover:text-white hover:underline" href="https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng" target="_blank" rel="noreferrer">
                Regulation (EU) 2023/1114 (MiCA) <ExternalLink className="h-4 w-4" />
              </a>
              <a className="inline-flex items-center gap-2 text-cyan-200 hover:text-white hover:underline" href="https://ethereum.org/en/whitepaper/" target="_blank" rel="noreferrer">
                Ethereum whitepaper <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Section>

          <div className="border-t border-white/10 pt-8 text-sm leading-6 text-blue-100/50">
            <div className="flex items-center gap-2 text-blue-100/70"><ShieldCheck className="h-4 w-4" /> Transparency statement</div>
            <p className="mt-2">
              This document prioritises onchain-verifiable facts and labels future intentions as plans rather than
              promises. It is not investment advice, an invitation to invest, or a guarantee of value, utility,
              liquidity, or regulatory treatment.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
