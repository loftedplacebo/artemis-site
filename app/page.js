import React from 'react';
import Link from 'next/link';
import {
  Rocket,
  Wallet,
  Zap,
  ArrowRight,
  Satellite,
  ShieldCheck,
  Lock,
  TrendingDown,
  X,
  Send,
  ExternalLink,
  FileText,
  Calculator,
} from 'lucide-react';
import CountdownCard from './components/landing/CountdownCard';
import {
  ARTEMIS_CONTRACTS,
  ARTEMIS_EXPLORER_ADDRESS_BASE,
} from '@/lib/web3/artemisContracts';

const verifiedContracts = [
  { label: 'Artemis Moon token', address: ARTEMIS_CONTRACTS.token },
  { label: 'Presale contract', address: ARTEMIS_CONTRACTS.presale },
  { label: 'Team lock', address: ARTEMIS_CONTRACTS.teamLock },
];

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const missionTimeline = [
  {
    phase: 'PRESALE — IGNITION',
    date: 'Start: Q1 2026',
    description: 'Presale opens, early supporters board and initial momentum begins building.',
    status: 'Upcoming',
  },
  {
    phase: 'PRESALE — FINAL BOARDING',
    date: 'End: Q1 2027',
    description: 'Presale closes, final allocations are locked and launch preparation begins.',
    status: 'Locked',
  },
  {
    phase: 'ARTEMIS ERA - LAUNCH WINDOW',
    date: 'Target: 2027 lunar mission window',
    description:
      'Project launch strategy aligns with wider Artemis-era lunar exploration attention.',
    status: 'Primary Event',
  },
  {
    phase: 'ARTEMIS IV — EXPANSION',
    date: 'Target: 2028',
    description:
      'Post-launch growth phase including partnerships, ecosystem expansion and community development.',
    status: 'Locked',
  },
];

const faqItems = [
  {
    question: 'What is Artemis Moon?',
    answer:
      'Artemis Moon is an Ethereum-based coin with a fixed supply of 10,000,000 ARMN tokens. It is designed as a mission-agnostic lunar token for the wider Artemis era of lunar exploration.',
  },
  {
    question: 'How can I buy $ARMN?',
    answer:
      'When the presale is activated, buyers can connect a compatible crypto wallet and pay with ETH, USDT or USDC on Ethereum mainnet.',
  },
  {
    question: 'Which network does Artemis Moon use?',
    answer:
      'Artemis Moon is built on Ethereum, allowing buyers to use widely supported wallets and a familiar on-chain buying experience.',
  },
  {
    question: 'What is the total supply of $ARMN?',
    answer:
      'The total supply is fixed at 10,000,000 ARMN, with no inflation. This creates a scarcity-driven structure designed to support narrative momentum and long-term positioning.',
  },
  {
    question: 'What is the presale structure?',
    answer:
      'The presale is split into multiple batches, with pricing increasing from $0.25 to $0.90. Early participants access the lowest pricing, while later rounds reflect increasing momentum.',
  },
  {
    question: 'When does the presale end?',
    answer:
      'The presale is scheduled to close on 31 March 2027, after which final allocations will be locked ahead of the planned public launch phase.',
  },
  {
    question: 'What is the target launch price?',
    answer:
      'The current target listing price is $1.00, aligned with the project’s broader launch strategy and exchange ambitions around the wider Artemis-era lunar window.',
  },
  {
    question: 'Will Artemis Moon be listed on exchanges?',
    answer:
      'The project is targeting a Tier 1 exchange listing, with launch timing designed to maximise visibility during the wider Artemis-era lunar period. This is an objective, not a guarantee.',
  },
  {
    question: 'Is liquidity locked?',
    answer:
      'No liquidity position has been created yet. Any future liquidity arrangement and lock evidence will be published before trading begins.',
  },
  {
    question: 'Do I need a crypto wallet to participate?',
    answer:
      'Yes. You will need a compatible crypto wallet to connect and complete your purchase during the presale.',
  },
];

function ButtonLink({ href, className = '', variant = 'default', children }) {
  const base =
    'inline-flex items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 rounded-2xl font-semibold border backdrop-blur-md active:scale-95';
  const variants = {
    default:
      'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-white border-blue-300/30 shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:from-blue-400 hover:via-sky-300 hover:to-cyan-200 hover:shadow-[0_0_40px_rgba(56,189,248,0.45)]',
    outline:
      'border border-blue-400/40 bg-blue-500/10 text-blue-100 shadow-inner hover:bg-blue-500/20 hover:border-blue-300/60',
    ghost:
      'border border-blue-400/20 bg-black/20 text-blue-100 hover:bg-blue-500/10 hover:border-blue-300/40',
  };

  return (
    <Link href={href} className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </Link>
  );
}

function Progress({ value = 0, className = '' }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default function ArtemisLandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.45),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(147,197,253,0.25),transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl border border-blue-400/25 bg-blue-500/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-semibold tracking-[0.18em] text-blue-50 uppercase">
                Artemis Moon
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-blue-200/45">
                Artemis Moon Network
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
  <ButtonLink
    href="/calculator"
    variant="ghost"
    className="hidden rounded-2xl h-11 px-4 text-sm md:inline-flex"
  >
    <Calculator className="mr-2 h-4 w-4" />
    Calculator
  </ButtonLink>
  <ButtonLink
    href="/control-centre"
    variant="ghost"
    className="hidden rounded-2xl h-11 px-4 text-sm lg:inline-flex"
  >
    <Satellite className="mr-2 h-4 w-4" />
    Control Centre
  </ButtonLink>
  <ButtonLink
    href="/whitepaper"
    variant="ghost"
    className="hidden rounded-2xl h-11 px-4 text-sm md:inline-flex"
  >
    <FileText className="mr-2 h-4 w-4" />
    Whitepaper
  </ButtonLink>
  {/* Social Icons */}
  <a
    href="https://x.com/ArtemisControl"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-2xl border border-blue-400/20 bg-black/20 flex items-center justify-center text-blue-200/70 hover:text-white hover:border-blue-300/40 transition"
  >
    <X className="w-4 h-4" />
  </a>

  <a
    href="https://t.me/artemismoonofficial"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-2xl border border-blue-400/20 bg-black/20 flex items-center justify-center text-blue-200/70 hover:text-white hover:border-blue-300/40 transition"
  >
    <Send className="w-4 h-4" />
  </a>

  {/* Buy Button */}
  <ButtonLink
    href="/presale"
    variant="outline"
    className="rounded-2xl h-11 px-5 text-sm font-semibold"
  >
    <Wallet className="w-4 h-4 mr-2" />
    Buy $ARMN
  </ButtonLink>
</div>
        </header>

        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="grid lg:grid-cols-2 gap-10 items-center pt-12 pb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-200 mb-5">
              <Satellite className="w-4 h-4" />
              Mission countdown now live
            </div>

            <h1
              id="hero-heading"
              className="text-5xl md:text-7xl font-semibold leading-[0.95] tracking-tight"
            >
              The coin
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-sky-300">
                built to go to the Moon.
              </span>
            </h1>

            <p className="mt-6 text-lg text-blue-100/70 max-w-2xl leading-8">
              When Artemis lands on the Moon, ARMN aims to list on a Tier 1 exchange - because in
              crypto, that is the Moon.
            </p>

            <p className="mt-5 text-base text-blue-100/65 max-w-2xl leading-8">
              Artemis Moon is an Ethereum-based coin with a fixed supply of 10,000,000 ARMN
              tokens. The verified Ethereum mainnet presale supports purchases using ETH, USDT or
              USDC when the onchain sale is activated.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href="/presale"
                className="rounded-2xl h-14 px-7 text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.35)]"
              >
                <Rocket className="w-4 h-4 mr-2" />
                View Presale
              </ButtonLink>

              <ButtonLink
                href="/presale"
                variant="outline"
                className="rounded-2xl h-14 px-7 text-base font-semibold"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </ButtonLink>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="#pricing" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                See Presale Pricing
              </ButtonLink>
              <ButtonLink href="#tokenomics" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                View Tokenomics
              </ButtonLink>
              <ButtonLink href="#faq" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                Read FAQ
              </ButtonLink>
              <ButtonLink href="/whitepaper" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                <FileText className="mr-2 h-4 w-4" />
                Whitepaper
              </ButtonLink>
              <ButtonLink href="/calculator" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                <Calculator className="mr-2 h-4 w-4" />
                Calculator
              </ButtonLink>
              <ButtonLink href="/control-centre" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                <Satellite className="mr-2 h-4 w-4" />
                Control Centre
              </ButtonLink>
            </div>

            <CountdownCard />
          </div>

          <div>
            <div className="relative rounded-[2rem] border border-blue-400/20 bg-blue-500/5 backdrop-blur-2xl p-4 shadow-2xl shadow-blue-900/60">
              <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden relative border border-blue-400/20 bg-black">
                <img
                  src="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?auto=format&fit=crop&w=1400&q=80"
                  alt="Moon and Earth from space"
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-950/30 to-transparent" />

                <div className="absolute top-4 left-4 right-4">
                  <div className="rounded-3xl border border-blue-400/20 bg-black/50 p-3 backdrop-blur-md">
                    <div className="text-xs text-blue-200/60 uppercase tracking-widest">
                      Mission Tracker
                    </div>
                    <div className="text-xl mt-1 text-blue-50">Key Milestones</div>

                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-blue-100/70 mb-1">
                          <span>Presale Start — Q1 2026</span>
                          <span>Ignition</span>
                        </div>
                        <Progress value={10} className="bg-blue-900/40" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-blue-100/70 mb-1">
                          <span>Batch 1 Complete</span>
                          <span>Early Crew Filled</span>
                        </div>
                        <Progress value={35} className="bg-blue-900/40" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-blue-100/70 mb-1">
                          <span>75% Allocated</span>
                          <span>Mid Mission</span>
                        </div>
                        <Progress value={65} className="bg-blue-900/40" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-blue-100/70 mb-1">
                          <span>Presale End — Q1 2027</span>
                          <span>Final Boarding</span>
                        </div>
                        <Progress value={90} className="bg-blue-900/40" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-blue-100/70 mb-1">
                          <span>Artemis era - 2027</span>
                          <span>Launch Window</span>
                        </div>
                        <Progress value={100} className="bg-blue-900/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="buy" aria-labelledby="buy-heading" className="py-4">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch mb-6">
            <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-cyan-300/15 p-6 md:p-8 shadow-[0_0_60px_rgba(56,189,248,0.12)]">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-sm uppercase tracking-[0.35em] text-cyan-200/55">
                    Ethereum mainnet presale
                  </div>
                  <h2 id="buy-heading" className="text-3xl md:text-4xl font-semibold mt-2 text-blue-50">
                    Prepare for the $ARMN presale.
                  </h2>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-sm text-cyan-100/80">
                  Onchain status shown in presale
                </div>
              </div>

              <p className="mt-6 text-blue-100/70 leading-8 max-w-3xl">
                Artemis Moon is an Ethereum coin built for humanity&apos;s return to the Moon across
                the wider Artemis era. The project combines a fixed 10,000,000 token supply,
                staged presale pricing and a transparent onchain structure designed to outlast
                any single mission number.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div className="rounded-3xl border border-cyan-300/20 bg-black/30 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-200/45">
                    Network
                  </div>
                  <h3 className="text-xl font-semibold text-blue-50 mt-2">Built on Ethereum</h3>
                  <div className="text-blue-100/65 mt-3 leading-7 text-sm">
                    Artemis Moon uses the Ethereum network for a familiar, trusted and widely supported
                    crypto buying experience.
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-300/20 bg-black/30 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-200/45">
                    Payments
                  </div>
                  <h3 className="text-xl font-semibold text-blue-50 mt-2">
                    Buy with ETH, USDT or USDC
                  </h3>
                  <div className="text-blue-100/65 mt-3 leading-7 text-sm">
                    The presale supports major crypto payment options when its onchain sale status
                    is activated.
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-300/20 bg-black/30 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-200/45">
                    Supply
                  </div>
                  <h3 className="text-xl font-semibold text-blue-50 mt-2">
                    Fixed 10,000,000 token supply
                  </h3>
                  <div className="text-blue-100/65 mt-3 leading-7 text-sm">
                    $ARMN has a fixed supply with no inflation, designed around scarcity and
                    narrative-led demand.
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-300/20 bg-black/30 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-200/45">
                    Pricing
                  </div>
                  <h3 className="text-xl font-semibold text-blue-50 mt-2">
                    Presale pricing from $0.25 to $0.90
                  </h3>
                  <div className="text-blue-100/65 mt-3 leading-7 text-sm">
                    The structured presale rewards early participation, with staged batch pricing
                    leading into the targeted $1.00 launch price.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <ButtonLink href="#pricing" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                  See Presale Batches
                </ButtonLink>
                <ButtonLink
                  href="#tokenomics"
                  variant="ghost"
                  className="rounded-2xl h-11 px-5 text-sm"
                >
                  View Supply Structure
                </ButtonLink>
                <ButtonLink href="#roadmap" variant="ghost" className="rounded-2xl h-11 px-5 text-sm">
                  Read Roadmap
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-400/20 bg-black/35 backdrop-blur-xl p-6 md:p-8">
              <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">Buy module</div>
              <h2 className="text-3xl font-semibold mt-2 text-blue-50">Launch-ready purchase panel</h2>
              <div className="text-blue-100/65 mt-3 leading-7">
                Connect your wallet, choose your allocation and buy $ARMN before final boarding
                closes.
              </div>

              <div className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-500/5 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                      Crew access
                    </div>
                    <h3 className="text-xl font-semibold text-blue-50 mt-2">Buy $ARMN now</h3>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                    Wallet supported
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-blue-400/20 bg-black/30 px-4 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                        Payment
                      </div>
                      <div className="text-blue-50 font-medium mt-1">ETH / USDT / USDC</div>
                    </div>
                    <Wallet className="w-5 h-5 text-blue-200" />
                  </div>
                  <div className="rounded-2xl border border-blue-400/20 bg-black/30 px-4 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                        Allocation status
                      </div>
                      <div className="text-blue-50 font-medium mt-1">Presale open</div>
                    </div>
                    <Zap className="w-5 h-5 text-cyan-200" />
                  </div>
                </div>

                <ButtonLink
                  href="/presale"
                  className="w-full mt-5 rounded-2xl h-14 text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                >
                  Buy $ARMN Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ButtonLink>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  {[
                    ['Presale', 'Open'],
                    ['Min. Buy', '$25'],
                    ['Accepted', 'Crypto'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-blue-400/20 bg-black/25 px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-blue-200/45">
                        {label}
                      </div>
                      <div className="text-sm font-semibold text-blue-50 mt-2">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            id="mission-alignment"
            aria-labelledby="mission-alignment-heading"
            className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-sky-300/10 p-6 md:p-8"
          >
            <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">
              Lunar Era Alignment
            </div>
            <h2
              id="mission-alignment-heading"
              className="text-3xl md:text-4xl font-semibold mt-2 text-blue-50"
            >
              Artemis Moon is built for the full lunar era.
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                  Global event
                </div>
                <h3 className="text-2xl font-semibold text-blue-50 mt-2">
                  Artemis-era lunar exploration
                </h3>
                <div className="text-blue-100/65 mt-2 leading-7">
                  The return-to-the-Moon narrative gives the project a real-world attention anchor
                  without depending on any single mission number or schedule.
                </div>
              </div>
              <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                  Launch strategy
                </div>
                <h3 className="text-2xl font-semibold text-blue-50 mt-2">
                  Tier 1 exchange ambition
                </h3>
                <div className="text-blue-100/65 mt-2 leading-7">
                  Presale closes on 31 March 2027, with launch momentum designed to build into
                  the Artemis era and maximise visibility. A Tier 1 listing remains an objective,
                  not a guarantee.
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {[
                ['Presale Start', 'Q1 2026'],
                ['Presale End', '31 March 2027'],
                ['Launch Window', 'Artemis era'],
                ['Exchange Goal', 'Tier 1 listing'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-blue-400/20 bg-blue-500/5 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                    {label}
                  </div>
                  <div className="text-xl font-semibold text-blue-50 mt-2">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" aria-labelledby="roadmap-heading" className="py-12">
          <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">Flight plan</div>
          <h2 id="roadmap-heading" className="text-3xl md:text-5xl font-semibold mt-2 text-blue-50">
            Built around a real-world space timeline.
          </h2>

          <div className="mt-8 space-y-4">
            {missionTimeline.map((item) => (
              <div
                key={item.phase}
                className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6"
              >
                <div className="text-blue-200/50 text-sm">{item.date}</div>
                <h3 className="text-xl font-semibold mt-2 text-blue-50">{item.phase}</h3>
                <div className="text-blue-100/60 mt-2">{item.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" aria-labelledby="pricing-heading" className="py-12">
          <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">Pricing Model</div>
          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-semibold mt-2 text-blue-50">
            Presale structure and raise target
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6">
              <h3 className="text-xl font-semibold text-blue-50">Raise Target</h3>
              <div className="text-4xl font-bold mt-2 text-cyan-300">~$3,125,000</div>
              <div className="text-blue-100/60 mt-3">
                Structured to build momentum ahead of a major exchange launch aligned with the
                wider Artemis era.
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6">
              <h3 className="text-xl font-semibold text-blue-50">Listing Price</h3>
              <div className="text-4xl font-bold mt-2 text-cyan-300">$1.00</div>
              <div className="text-blue-100/60 mt-3">
                Targeted Tier 1 exchange launch during peak attention around lunar exploration.
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-sky-400/10 p-6 mt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-semibold text-blue-50">Presale Batches</h3>
                <div className="text-blue-100/60 mt-1 text-sm">
                  Structured supply by tranche to reward early boarding.
                </div>
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-200">
                Batch pricing live
              </div>
            </div>

            <div className="space-y-4 mt-5">
              {[
                {
                  label: 'Batch 1',
                  price: '$0.25',
                  supply: '500k ARMN',
                  remaining: '90% remaining',
                  progress: 10,
                  badge: 'Current Batch',
                  highlight: true,
                  kicker: 'Limited early access',
                },
                {
                  label: 'Batch 2',
                  price: '$0.40',
                  supply: '750k ARMN',
                  remaining: '+60% from Batch 1',
                  progress: 0,
                  badge: 'Next Up',
                  highlight: false,
                  kicker: 'Early momentum',
                },
                {
                  label: 'Batch 3',
                  price: '$0.55',
                  supply: '1M ARMN',
                  remaining: 'Mid-mission pricing',
                  progress: 0,
                  badge: '',
                  highlight: false,
                  kicker: 'Strong positioning',
                },
                {
                  label: 'Batch 4',
                  price: '$0.70',
                  supply: '1M ARMN',
                  remaining: 'Momentum phase',
                  progress: 0,
                  badge: '',
                  highlight: false,
                  kicker: 'Approaching launch',
                },
                {
                  label: 'Batch 5',
                  price: '$0.80',
                  supply: '1.25M ARMN',
                  remaining: 'Pre-launch pricing',
                  progress: 0,
                  badge: '',
                  highlight: false,
                  kicker: 'Main accumulation phase',
                },
                {
                  label: 'Final Boarding',
                  price: '$0.90',
                  supply: '500k ARMN',
                  remaining: 'Last allocation before launch',
                  progress: 0,
                  badge: '',
                  highlight: false,
                  kicker: 'Exchange-level pricing',
                },
              ].map((batch) => (
                <div
                  key={batch.label}
                  className={`rounded-2xl px-4 py-4 ${
                    batch.highlight
                      ? 'border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.18)]'
                      : 'border border-blue-400/20 bg-black/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">
                          {batch.label}
                        </div>
                        {batch.badge ? (
                          <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                            {batch.badge}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-blue-50 font-semibold mt-1 text-lg">{batch.price}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-blue-100/45 mt-1">
                        {batch.kicker}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-blue-100/75">{batch.supply}</div>
                      <div
                        className={`text-xs uppercase tracking-[0.2em] mt-1 ${
                          batch.highlight ? 'text-cyan-200' : 'text-blue-200/55'
                        }`}
                      >
                        {batch.remaining}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-blue-200/45 mb-2">
                      <span>Allocation status</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <Progress
                      value={batch.progress}
                      className={batch.highlight ? 'bg-cyan-950/40' : 'bg-blue-900/40'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Entry Advantage</div>
              <h3 className="text-blue-50 font-semibold mt-2">Pre-launch position</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                Secure tokens before a potential Tier 1 exchange listing aligned with a major global
                narrative.
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Narrative Driver</div>
              <h3 className="text-blue-50 font-semibold mt-2">Artemis era</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                Launch timing is built around one of the strongest space narratives in decades.
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Market Behaviour</div>
              <h3 className="text-blue-50 font-semibold mt-2">Price discovery potential</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                Major exchange launches often create sharp repricing and significant early
                volatility.
              </div>
            </div>
          </div>

          <div className="mt-6 border-y border-blue-400/20 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-blue-200/45 text-xs uppercase tracking-[0.25em]">
                  Ethereum Mainnet
                </div>
                <h3 className="mt-2 text-xl font-semibold text-blue-50">Verified Contracts</h3>
              </div>
              <div className="text-sm text-blue-100/60">
                Source code and deployment details are public on Etherscan.
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {verifiedContracts.map((contract) => (
                <a
                  key={contract.address}
                  href={`${ARTEMIS_EXPLORER_ADDRESS_BASE}/${contract.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 border-b border-blue-400/15 pb-3 text-blue-100 transition-colors hover:text-cyan-200"
                >
                  <span>
                    <span className="block text-sm font-semibold">{contract.label}</span>
                    <span className="mt-1 block font-mono text-xs text-blue-100/55">
                      {formatAddress(contract.address)}
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="tokenomics" aria-labelledby="tokenomics-heading" className="py-12">
          <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">Tokenomics</div>
          <h2
            id="tokenomics-heading"
            className="text-3xl md:text-5xl font-semibold mt-2 text-blue-50"
          >
            Mission supply structure
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 border border-emerald-300/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
              <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">Liquidity</div>
                <div className="text-blue-50 font-semibold">Planned</div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">Supply</div>
                <div className="text-blue-50 font-semibold">No Inflation</div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-400/10 border border-purple-300/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45">Team</div>
                <div className="text-blue-50 font-semibold">Locked to 2029</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6">
              <h3 className="text-xl font-semibold text-blue-50">Total Supply</h3>
              <div className="text-4xl font-bold mt-2 text-cyan-300">10,000,000 ARMN</div>
              <div className="text-blue-100/60 mt-3">
                Fixed supply with no inflation, designed around scarcity and narrative-driven
                demand.
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6">
              <h3 className="text-xl font-semibold text-blue-50">Allocation</h3>
              <div className="space-y-4 mt-4">
                {[
                  ['Presale', '50%'],
                  ['Liquidity', '20%'],
                  ['Growth Fund', '15%'],
                  ['Treasury', '10%'],
                  ['Team (2029 Lock)', '5%'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="text-blue-100/70">{label}</div>
                    <div className="text-blue-50 font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Liquidity</div>
              <h3 className="text-blue-50 font-semibold mt-2">Planned for Launch</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                Liquidity is planned for launch. No liquidity position has been created or locked
                yet; any future lock will be published with onchain proof.
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Team Tokens</div>
              <h3 className="text-blue-50 font-semibold mt-2">Locked Until 1 January 2029</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                The 500,000 ARMN team allocation is locked onchain and cannot unlock before
                1 January 2029 at 00:00 UTC.
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-black/30 p-5">
              <div className="text-blue-200/45 text-xs uppercase">Treasury</div>
              <h3 className="text-blue-50 font-semibold mt-2">Mission Fund</h3>
              <div className="text-blue-100/60 mt-2 text-sm">
                Strategic reserve used for listings, partnerships and long-term mission execution.
              </div>
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className="py-12">
          <div className="text-sm uppercase tracking-[0.35em] text-blue-200/45">
            Frequently Asked Questions
          </div>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-semibold mt-2 text-blue-50">
            Everything you need to know before buying $ARMN.
          </h2>
          <div className="text-blue-100/65 mt-4 max-w-3xl leading-8">
            Artemis Moon is designed to be simple to understand: a fixed-supply Ethereum coin, a
            verified Ethereum mainnet presale, and a launch strategy built around one of the most recognisable
            lunar exploration narratives in the world.
          </div>

          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[2rem] border border-blue-400/20 bg-blue-500/5 p-6"
              >
                <h3 className="text-xl font-semibold text-blue-50">{item.question}</h3>
                <p className="text-blue-100/65 mt-3 leading-8">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-16 pt-10 pb-8 border-t border-blue-400/10 text-center">

      {/* Back to top */}
      <div className="flex justify-center mb-6">
        <a
          href="#hero"
          className="w-12 h-12 rounded-2xl border border-blue-400/20 bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition"
        >
          <Rocket className="w-5 h-5 text-blue-200" />
        </a>
      </div>

      {/* Social links again (optional but strong) */}
      <div className="flex justify-center gap-4 mb-6">
        <a
          href="https://x.com/ArtemisControl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200/60 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </a>
        <a
          href="https://t.me/artemismoonofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200/60 hover:text-white transition"
        >
          <Send className="w-5 h-5" />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-blue-100/40 max-w-3xl mx-auto leading-6 px-4">
        Cryptocurrency investments are highly speculative and involve significant risk. The value of cryptocurrencies can fluctuate widely, and there is a risk of losing all of your investment. You should carefully consider your investment objectives, level of experience, and risk tolerance before making any investment decisions.
      </p>

    </footer>
    </main>
  );
}
