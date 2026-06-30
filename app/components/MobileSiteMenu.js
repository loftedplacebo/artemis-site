'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calculator,
  Gamepad2,
  Home,
  Menu,
  Rocket,
  Satellite,
  Wallet,
  X as CloseIcon,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Mission Control', icon: Home },
  { href: '/presale', label: 'Buy $ARMN', icon: Wallet, primary: true },
  { href: '/game', label: 'Solar System Game', icon: Gamepad2 },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/control-centre', label: 'Control Centre', icon: Satellite },
  { href: '/whitepaper', label: 'Whitepaper', icon: BookOpen },
];

export default function MobileSiteMenu({ className = '', hideAt = 'md' }) {
  const [open, setOpen] = useState(false);
  const visibilityClass = hideAt === 'lg' ? 'lg:hidden' : 'md:hidden';

  return (
    <div className={`relative ${visibilityClass} ${className}`}>
      <button
        type="button"
        aria-label={open ? 'Close site menu' : 'Open site menu'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/30 bg-black/20 text-blue-50 shadow-[0_10px_25px_rgba(2,6,23,0.2)] backdrop-blur-md transition hover:border-cyan-200/45 hover:bg-blue-500/15"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 cursor-default bg-black/20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-blue-200/20 bg-[#071436]/95 p-2 shadow-[0_24px_70px_rgba(2,6,23,0.55)] backdrop-blur-xl">
            <div className="px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">
                <Rocket className="h-4 w-4" />
                Artemis Moon
              </div>
            </div>

            <nav aria-label="Mobile site navigation" className="space-y-1">
              {links.map(({ href, label, icon: Icon, primary }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-2xl px-3 text-sm font-semibold transition ${
                    primary
                      ? 'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-white shadow-[0_10px_28px_rgba(56,189,248,0.24)]'
                      : 'text-blue-50/82 hover:bg-blue-500/12 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <a
              href="https://x.com/ArtemisControl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-12 items-center rounded-2xl px-3 text-sm font-semibold text-blue-50/82 transition hover:bg-blue-500/12 hover:text-white"
            >
              <CloseIcon className="mr-3 h-4 w-4 shrink-0" />
              Follow on X
            </a>
          </div>
        </>
      )}
    </div>
  );
}
