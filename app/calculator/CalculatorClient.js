'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Info,
  Rocket,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';

const batches = [
  { name: 'Batch 1', price: 0.25, supply: '500k ARMN', note: 'Ignition' },
  { name: 'Batch 2', price: 0.4, supply: '750k ARMN', note: 'Lift-off' },
  { name: 'Batch 3', price: 0.55, supply: '1m ARMN', note: 'Orbit' },
  { name: 'Batch 4', price: 0.7, supply: '1m ARMN', note: 'Lunar approach' },
  { name: 'Batch 5', price: 0.8, supply: '1.25m ARMN', note: 'Moonbound' },
  { name: 'Final boarding', price: 0.9, supply: '500k ARMN', note: 'Last call' },
];

const futurePrices = Array.from({ length: 10 }, (_, index) => index + 1);

const milestones = [
  {
    threshold: 1000,
    label: 'Moon rock',
    amount: '$1,000',
    image: '/images/calculator/moon-rock.png',
    alt: 'A glowing Moon rock on a display plinth',
    description: 'Your own Moon rock moment: a little piece of lunar legend for the mantelpiece.',
  },
  {
    threshold: 10000,
    label: 'Moon buggy',
    amount: '$10,000',
    image: '/images/calculator/moon-buggy.png',
    alt: 'A futuristic lunar rover on the Moon',
    description: 'Time to cruise the lunar flats in a Moon buggy built for the regolith.',
  },
  {
    threshold: 500000,
    label: 'Ride to space',
    amount: '$500k',
    image: '/images/calculator/spaceplane.png',
    alt: 'A sleek spaceplane flying over Earth',
    description: 'A boarding-pass-to-space kind of moment, with Earth shrinking below you.',
  },
  {
    threshold: 1000000,
    label: 'Your own rocket',
    amount: '$1m',
    image: '/images/calculator/private-rocket.png',
    alt: 'A private rocket launching through a starry sky',
    description: 'Your own rocket, ready to turn the Moon from a dream into a destination.',
  },
];

const contributionPresets = [100, 1000, 10000, 100000];

function currency(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

function quantity(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

function scenarioLabel(price) {
  if (price === 1) return 'Target';
  if (price === 10) return 'Moon';
  if (price >= 7) return 'Escape velocity';
  if (price >= 4) return 'Lunar trajectory';
  return 'Orbit path';
}

export default function CalculatorClient() {
  const [batchIndex, setBatchIndex] = useState(0);
  const [contribution, setContribution] = useState(1000);
  const [futurePrice, setFuturePrice] = useState(1);

  const batch = batches[batchIndex];
  const safeContribution = Math.max(0, Number(contribution) || 0);
  const allocatedTokens = safeContribution / batch.price;
  const scenarioValue = allocatedTokens * futurePrice;
  const scenarioMultiple = futurePrice / batch.price;
  const activeMilestoneIndex = milestones.reduce(
    (index, milestone, nextIndex) => (scenarioValue >= milestone.threshold ? nextIndex : index),
    -1
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11377f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.48),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.32),transparent_35%),radial-gradient(circle_at_18%_80%,rgba(147,197,253,0.18),transparent_38%)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(white 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-6 md:py-8">
        <header className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10">
              <Rocket className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="text-lg font-semibold uppercase tracking-[0.18em] text-blue-50 md:text-xl">Artemis Moon</div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-blue-200/45">Artemis Moon Network</div>
            </div>
          </Link>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link
              href="/"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-blue-400/20 bg-black/20 px-3 text-sm text-blue-100 transition hover:border-blue-300/40 hover:bg-blue-500/10 sm:flex-none sm:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Mission Control
            </Link>
            <Link
              href="/presale"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-blue-400/40 bg-blue-500/10 px-3 text-sm font-semibold text-blue-100 shadow-inner transition hover:border-blue-300/60 hover:bg-blue-500/20 sm:flex-none sm:px-5"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Buy $ARMN
            </Link>
          </div>
        </header>

        <section className="pb-8 pt-7 md:pb-12 md:pt-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div>
              <h1 className="max-w-none text-4xl font-semibold leading-tight text-white md:text-6xl">
                Pick a batch. Plot a <span className="text-cyan-300">Moonshot.</span>
              </h1>
              <p className="mt-5 max-w-none text-lg leading-8 text-blue-100/75">
                Explore how a contribution at each ARMN presale price translates into tokens, then compare purely
                illustrative values from the $1 target scenario to the $10 Moon scenario.
              </p>
            </div>

            <div className="border border-cyan-200/20 bg-slate-950/50 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <Target className="h-4 w-4" />
                Your current flight plan
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase text-blue-100/50">Selected batch</div>
                  <div className="mt-1 text-xl font-semibold text-white">{batch.name}</div>
                  <div className="text-sm text-cyan-200">{currency(batch.price, 2)} per ARMN</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-blue-100/50">Scenario price</div>
                  <div className="mt-1 text-xl font-semibold text-white">{currency(futurePrice, 0)}</div>
                  <div className="text-sm text-cyan-200">{scenarioLabel(futurePrice)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="border border-blue-200/20 bg-slate-950/60 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase text-cyan-200/60">01 / Presale entry</div>
                <h2 className="mt-2 text-2xl font-semibold text-white">Choose your boarding batch</h2>
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                {currency(batch.price, 2)}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={batches.length - 1}
              step="1"
              value={batchIndex}
              onChange={(event) => setBatchIndex(Number(event.target.value))}
              className="mt-8 h-2 w-full cursor-pointer accent-cyan-300"
              aria-label="Presale batch"
            />
            <div className="mt-4 grid grid-cols-6 gap-2">
              {batches.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setBatchIndex(index)}
                  className={`min-w-0 border px-2 py-2 text-left transition ${
                    index === batchIndex
                      ? 'border-cyan-300/55 bg-cyan-300/15 text-white shadow-[0_0_24px_rgba(34,211,238,0.16)]'
                      : 'border-white/10 bg-white/[0.03] text-blue-100/60 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="text-[10px] font-semibold">{index + 1}</div>
                  <div className="mt-1 text-xs text-cyan-100">{currency(item.price, 2)}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-white">{batch.name}: {batch.note}</span>
              <span className="text-blue-100/55">{batch.supply} allocated</span>
            </div>

            <div className="mt-9 border-t border-white/10 pt-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase text-cyan-200/60">02 / Contribution</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Set your hypothetical buy</h2>
                </div>
                <label className="flex items-center border border-cyan-300/25 bg-black/20 px-3 py-2">
                  <span className="mr-1 text-blue-100/55">$</span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={contribution}
                    onChange={(event) => setContribution(event.target.value)}
                    className="w-28 bg-transparent text-right text-xl font-semibold text-white outline-none"
                    aria-label="Contribution in US dollars"
                  />
                </label>
              </div>

              <input
                type="range"
                min="25"
                max="100000"
                step="25"
                value={Math.min(Math.max(safeContribution || 25, 25), 100000)}
                onChange={(event) => setContribution(Number(event.target.value))}
                className="mt-7 h-2 w-full cursor-pointer accent-cyan-300"
                aria-label="Contribution slider"
              />
              <div className="mt-2 flex justify-between text-xs text-blue-100/45">
                <span>$25 minimum</span>
                <span>$100k slider range</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {contributionPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setContribution(preset)}
                    className={`border px-3 py-2 text-sm transition ${
                      safeContribution === preset
                        ? 'border-cyan-300/55 bg-cyan-300/15 text-cyan-50'
                        : 'border-white/10 bg-white/[0.03] text-blue-100/70 hover:bg-white/[0.08]'
                    }`}
                  >
                    {currency(preset, 0)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-9 border-t border-white/10 pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase text-cyan-200/60">03 / Future price scenario</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Set the flight altitude</h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-cyan-200">{currency(futurePrice, 0)}</div>
                  <div className="text-xs text-blue-100/55">per ARMN</div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={futurePrice}
                onChange={(event) => setFuturePrice(Number(event.target.value))}
                className="mt-7 h-2 w-full cursor-pointer accent-cyan-300"
                aria-label="Illustrative future ARMN price"
              />
              <div className="mt-4 grid grid-cols-10 gap-1">
                {futurePrices.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setFuturePrice(price)}
                    className={`h-9 border text-xs font-semibold transition ${
                      price === futurePrice
                        ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                        : 'border-white/10 bg-white/[0.03] text-blue-100/65 hover:bg-white/[0.08]'
                    }`}
                    aria-label={`Set future price to ${currency(price, 0)}`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-blue-100/55">
                <span>$1 aimed launch price</span>
                <span>$10 Moon scenario</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="border border-cyan-200/25 bg-gradient-to-br from-cyan-300/15 to-blue-500/15 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.3)] backdrop-blur-xl md:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Your illustrated scenario
              </div>
              <div className="mt-7 grid gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div>
                  <div className="text-sm text-blue-100/65">At {currency(batch.price, 2)} per ARMN, {currency(safeContribution, 0)} would allocate</div>
                  <div className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
                    {quantity(allocatedTokens, 0)} <span className="text-cyan-200">ARMN</span>
                  </div>
                </div>
                <div className="border border-cyan-300/25 bg-slate-950/25 p-5 md:p-6">
                  <div className="text-sm text-blue-100/70">At the {currency(futurePrice, 0)} {scenarioLabel(futurePrice).toLowerCase()} scenario</div>
                  <div className="mt-2 text-5xl font-semibold leading-none text-cyan-200 md:text-6xl">{currency(scenarioValue, 0)}</div>
                  <div className="mt-4 border-t border-white/15 pt-4 text-sm text-blue-100/65">
                    Illustrative {quantity(scenarioMultiple, 2)}x of the selected batch price.
                  </div>
                </div>
              </div>
            </section>

            <section className="border border-white/15 bg-slate-950/60 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.26)] md:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs uppercase text-cyan-200/60">Moonshot moments</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">How far could Artemis Moon take you?</h2>
                </div>
                <div className="text-sm text-blue-100/55">Playful value comparisons only</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {milestones.map((milestone, index) => {
                  const active = index === activeMilestoneIndex;
                  const reached = scenarioValue >= milestone.threshold;

                  return (
                    <div
                      key={milestone.label}
                      className={`group overflow-hidden border transition ${
                        active
                          ? 'border-cyan-300/65 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.16)]'
                          : reached
                            ? 'border-blue-300/30 bg-blue-300/[0.05]'
                            : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={milestone.image}
                          alt={milestone.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className={`object-cover transition duration-500 ${reached ? 'opacity-100' : 'opacity-55 grayscale-[35%]'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-xs text-cyan-100">
                          {milestone.amount}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-white">{milestone.label}</h3>
                          {active && <span className="text-xs font-semibold text-cyan-200">Current moment</span>}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-blue-100/65">{milestone.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 flex gap-2 text-xs leading-5 text-blue-100/50">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200/70" />
                The images and amounts are creative comparison points only. They are not rewards, product offers, or a
                prediction of ARMN&apos;s future market price or value.
              </p>
            </section>
          </div>
        </section>

        <section className="mt-8 flex flex-col justify-between gap-5 border border-blue-200/20 bg-black/20 p-5 text-sm text-blue-100/70 md:flex-row md:items-center md:p-6">
          <div className="flex max-w-3xl gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
            <p>
              This calculator is for illustration and entertainment. It does not account for available batch supply,
              fees, tax, market liquidity, token availability, or any future price movement. ARMN can lose all value.
            </p>
          </div>
          <Link href="/whitepaper" className="inline-flex items-center gap-2 font-semibold text-cyan-200 hover:text-white hover:underline">
            Read the whitepaper <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
