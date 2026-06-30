import Link from 'next/link';
import { BookOpen, Calculator, Gamepad2, Rocket, Satellite, Wallet } from 'lucide-react';

const siteUrl = 'https://artemismoon.io';
const gameUrl = '/games/artemis-solar-system/';

export const metadata = {
  title: 'Artemis Solar System Game',
  description:
    'Play the Artemis Moon solar system trajectory game. Explore planets, lunar transfer estimates and the Artemis-era space narrative behind $ARMN.',
  alternates: {
    canonical: '/game',
  },
  keywords: [
    'Artemis Moon game',
    'solar system game',
    'Artemis 3 game',
    'moon mission game',
    'ARMN',
    'Artemis Moon token',
  ],
  openGraph: {
    type: 'website',
    url: '/game',
    siteName: 'Artemis Moon',
    title: 'Play the Artemis Solar System Game',
    description:
      'Plot a trajectory across the solar system and explore the Artemis-era lunar story behind $ARMN.',
    images: [
      {
        url: `${siteUrl}/social-card.png`,
        width: 1200,
        height: 630,
        alt: 'Artemis Moon social preview with lunar mission artwork',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ArtemisControl',
    creator: '@ArtemisControl',
    title: 'Play the Artemis Solar System Game',
    description:
      'Plot a trajectory across the solar system and explore the Artemis-era lunar story behind $ARMN.',
    images: [`${siteUrl}/social-card.png`],
  },
};

function NavButton({ href, children, primary = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition active:scale-95 ${
        primary
          ? 'border-blue-300/30 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:from-blue-400 hover:to-cyan-200'
          : 'border-blue-400/25 bg-black/20 text-blue-100 hover:border-blue-300/50 hover:bg-blue-500/10'
      }`}
    >
      {children}
    </Link>
  );
}

export default function ArtemisGamePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Artemis Solar System Trajectory Game',
    url: `${siteUrl}/game`,
    applicationCategory: 'Game',
    operatingSystem: 'Web browser',
    description:
      'A browser-based Artemis Moon solar system trajectory game with planets, lunar transfer estimates and interactive canvas gameplay.',
    genre: ['Educational', 'Space', 'Simulation'],
    publisher: {
      '@type': 'Organization',
      name: 'Artemis Moon',
      url: siteUrl,
    },
    image: `${siteUrl}/social-card.png`,
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#123b82] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.55),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.28),transparent_32%),linear-gradient(180deg,#113f90_0%,#0b1a42_100%)]" />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-500/15">
              <Rocket className="h-5 w-5 text-blue-100" />
            </div>
            <div>
              <div className="text-lg font-semibold uppercase tracking-[0.18em] text-blue-50 md:text-xl">
                Artemis Moon
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-blue-100/55">
                Solar System Game
              </div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-3">
            <NavButton href="/control-centre">
              <Satellite className="mr-2 h-4 w-4" />
              Control Centre
            </NavButton>
            <NavButton href="/calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Calculator
            </NavButton>
            <NavButton href="/presale" primary>
              <Wallet className="mr-2 h-4 w-4" />
              Buy $ARMN
            </NavButton>
          </nav>
        </header>

        <section className="grid gap-6 pb-6 pt-9 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              <Gamepad2 className="h-4 w-4" />
              Interactive mission game
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-tight text-white md:text-6xl">
              Plot a route through the solar system.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-blue-50/78 md:text-lg">
              Launch from Earth, aim for the Moon, or test wild routes across the planets. The
              Artemis Solar System Game turns the lunar mission narrative into a playable browser
              experience built for sharing.
            </p>
          </div>

          <aside className="rounded-3xl border border-blue-200/20 bg-black/20 p-5 shadow-2xl shadow-blue-950/35 backdrop-blur-md">
            <h2 className="flex items-center text-lg font-semibold text-blue-50">
              <Rocket className="mr-2 h-5 w-5 text-cyan-200" />
              From game to mission
            </h2>
            <p className="mt-3 text-sm leading-7 text-blue-50/72">
              Artemis Moon connects a fixed-supply Ethereum token with the public excitement around
              the Artemis era. Play the game, read the mission coverage, then visit the presale page
              to see the verified contracts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <NavButton href="/whitepaper">
                <BookOpen className="mr-2 h-4 w-4" />
                Whitepaper
              </NavButton>
              <NavButton href="/presale" primary>
                <Rocket className="mr-2 h-4 w-4" />
                Presale
              </NavButton>
            </div>
          </aside>
        </section>

        <section className="flex-1 rounded-[2rem] border border-cyan-200/20 bg-blue-950/40 p-2 shadow-2xl shadow-blue-950/50 backdrop-blur-md sm:p-3">
          <iframe
            src={gameUrl}
            title="Artemis Solar System Trajectory Game"
            className="h-[78vh] min-h-[680px] w-full rounded-[1.5rem] border-0 bg-black"
            loading="eager"
            allow="fullscreen; gamepad; autoplay"
          />
        </section>

        <section className="grid gap-5 py-10 md:grid-cols-3">
          <div className="rounded-3xl border border-blue-200/15 bg-black/18 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-blue-50">Built for sharing</h2>
            <p className="mt-3 text-sm leading-7 text-blue-50/70">
              The page includes large-card social metadata for X, Telegram, Discord and other
              platforms that read Open Graph previews.
            </p>
          </div>
          <div className="rounded-3xl border border-blue-200/15 bg-black/18 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-blue-50">Search-friendly context</h2>
            <p className="mt-3 text-sm leading-7 text-blue-50/70">
              Search engines get readable content about the Artemis Moon game, solar system
              gameplay, lunar missions and $ARMN.
            </p>
          </div>
          <div className="rounded-3xl border border-blue-200/15 bg-black/18 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-blue-50">Part of the mission hub</h2>
            <p className="mt-3 text-sm leading-7 text-blue-50/70">
              The game links into the presale, calculator, whitepaper and Control Centre so visitors
              can move naturally through the Artemis Moon site.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
