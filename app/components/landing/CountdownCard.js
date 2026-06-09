'use client';

import React, { useEffect, useMemo, useState } from 'react';

const PRESALE_END_DATE = '2027-03-31T23:59:59Z';

function getTimeRemaining(targetDate) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    complete: false,
  };
}

export default function CountdownCard() {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(PRESALE_END_DATE));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const mountTimeout = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(PRESALE_END_DATE));
    }, 1000);

    return () => {
      window.clearTimeout(mountTimeout);
      clearInterval(interval);
    };
  }, []);

  const countdownBlocks = useMemo(
    () => [
      { label: 'Days', value: isMounted ? String(timeRemaining.days).padStart(2, '0') : '--' },
      { label: 'Hours', value: isMounted ? String(timeRemaining.hours).padStart(2, '0') : '--' },
      { label: 'Minutes', value: isMounted ? String(timeRemaining.minutes).padStart(2, '0') : '--' },
      { label: 'Seconds', value: isMounted ? String(timeRemaining.seconds).padStart(2, '0') : '--' },
    ],
    [timeRemaining, isMounted]
  );

  return (
    <div className="mt-8 rounded-[2rem] border border-blue-400/20 bg-blue-500/5 backdrop-blur-xl p-5 md:p-6 max-w-2xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-blue-200/45">Live countdown</div>
          <div className="text-2xl md:text-3xl font-semibold text-blue-50 mt-2">
            Presale ends 31 March 2027
          </div>
        </div>
        <div className="rounded-full border border-blue-400/20 bg-black/30 px-4 py-2 text-sm text-blue-100/75">
          {!isMounted
            ? 'Syncing telemetry'
            : timeRemaining.complete
              ? 'Presale complete'
              : 'Final boarding in progress'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {countdownBlocks.map((block) => (
          <div
            key={block.label}
            className="rounded-3xl border border-blue-400/20 bg-black/35 p-4 text-center"
          >
            <div className="text-3xl md:text-4xl font-semibold text-blue-50">{block.value}</div>
            <div className="text-xs uppercase tracking-[0.25em] text-blue-200/45 mt-2">
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
