import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Rocket,
  Satellite,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { controlCentreArticles, controlCentreUpdated } from './missionContent';

const siteUrl = 'https://artemismoon.io';
const featuredNav = [
  ['Overview', '/control-centre'],
  ['Artemis III', '/control-centre/artemis-iii'],
  ['Artemis IV', '/control-centre/artemis-iv'],
  ['SLS Rocket', '/control-centre/sls-rocket'],
  ['South Pole', '/control-centre/lunar-south-pole'],
];

export const metadata = {
  title: 'Artemis Control Centre | NASA Artemis Mission Guides',
  description:
    'Artemis Control Centre: SEO-friendly mission guides for Artemis II, Artemis III, Artemis IV, SLS, the lunar South Pole and the Moon-to-Mars campaign.',
  alternates: {
    canonical: '/control-centre',
  },
  openGraph: {
    title: 'Artemis Control Centre',
    description:
      'Track Artemis mission dates, rocket details, lunar South Pole plans and the Moon landing narrative behind Artemis Moon.',
    url: '/control-centre',
    images: ['/images/calculator/private-rocket.png'],
  },
};

function ControlButton({ href, children, variant = 'primary' }) {
  const styles =
    variant === 'primary'
      ? 'border-cyan-200/30 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-white shadow-[0_14px_34px_rgba(56,189,248,0.26)]'
      : 'border-blue-300/25 bg-blue-500/10 text-blue-50 hover:bg-blue-500/20';

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition ${styles}`}
    >
      {children}
    </Link>
  );
}

export default function ControlCentrePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Artemis Control Centre',
    description: metadata.description,
    url: `${siteUrl}/control-centre`,
    dateModified: controlCentreUpdated,
    hasPart: controlCentreArticles.map((article) => ({
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      url: `${siteUrl}/control-centre/${article.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#123f8a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_34%),linear-gradient(180deg,#123f8a_0%,#0b2560_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:34px_34px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200/30 bg-blue-500/20">
                <Rocket className="h-5 w-5 text-blue-100" />
              </span>
              <span>
                <span className="block text-lg font-semibold uppercase tracking-[0.18em] text-blue-50">
                  Artemis
                </span>
                <span className="block text-[11px] uppercase tracking-[0.32em] text-blue-100/50">
                  Control Centre
                </span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-3">
              <ControlButton href="/presale" variant="secondary">
                <Wallet className="mr-2 h-4 w-4" />
                Buy $ARMN
              </ControlButton>
              <ControlButton href="/whitepaper" variant="secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                Whitepaper
              </ControlButton>
            </nav>
          </header>

          <nav
            aria-label="Control Centre mission navigation"
            className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/18 p-2"
          >
            {featuredNav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-xl border border-blue-200/15 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-50/80 transition hover:border-cyan-200/35 hover:bg-cyan-300/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Satellite className="mr-2 h-4 w-4" />
                Artemis mission guides and Moon landing watch
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                Control Centre for the Artemis era.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50/75">
                Follow the missions, rockets, astronauts and lunar South Pole plans shaping the next
                wave of Moon attention. Learn the real Artemis timeline, then explore the independent
                ARMN coin built around the countdown.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ControlButton href="/control-centre/artemis-iv">
                  Track Artemis IV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ControlButton>
                <ControlButton href="/presale" variant="secondary">
                  View Presale
                </ControlButton>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-950/35 p-3 shadow-[0_24px_70px_rgba(2,6,23,0.35)]">
                <Image
                  src="/images/calculator/private-rocket.png"
                  alt="A rocket launching during a lunar mission countdown"
                  width={1024}
                  height={1024}
                  priority
                  className="aspect-[4/3] rounded-[1.5rem] object-cover"
                />
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Artemis III', '2027 demonstration'],
                    ['Artemis IV', 'Early 2028 landing watch'],
                    ['SLS', 'Moon rocket'],
                    ['South Pole', 'Landing region focus'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-blue-100/45">{label}</div>
                      <div className="mt-1 font-semibold text-blue-50">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">
              Mission index
            </div>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
              Explore the missions shaping the next Moon moment.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-blue-50/65">
            Deep-dive guides for the Artemis timeline, the SLS rocket, the lunar South Pole and the
            landing window that could bring global attention back to the Moon.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {controlCentreArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/control-centre/${article.slug}`}
              className="group overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.07] shadow-[0_18px_45px_rgba(2,6,23,0.2)] transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.1]"
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                width={1024}
                height={1024}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                  <CalendarDays className="h-4 w-4" />
                  {article.eyebrow}
                </div>
                <h3 className="mt-3 text-xl font-semibold leading-7 text-white">{article.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-blue-50/65">
                  {article.description}
                </p>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-100">
                  Open mission page
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-cyan-200/20 bg-slate-950/45 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Independent, sourced and onchain
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Do not miss the mission window.
              </h2>
              <p className="mt-3 text-blue-50/70 leading-8">
                Artemis Moon is independent of NASA, but it is built for the same public moment:
                humanity looking back to the Moon. Read the mission guides, inspect the verified
                contracts, then decide whether to secure an ARMN presale allocation before the
                Artemis coverage cycle gets louder.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <ControlButton href="/presale">
                View Presale
              </ControlButton>
              <a
                href="https://www.nasa.gov/humans-in-space/artemis/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-50 transition hover:bg-blue-500/20"
              >
                NASA Artemis source
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs leading-6 text-blue-100/45">
            Artemis Moon is an independent crypto project and is not affiliated with, endorsed by,
            or sponsored by NASA. ARMN can lose all value.
          </p>
        </div>
      </section>
    </main>
  );
}
