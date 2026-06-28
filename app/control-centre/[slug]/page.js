import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Rocket,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  controlCentreArticles,
  controlCentreUpdated,
  getControlCentreArticle,
} from '../missionContent';

const siteUrl = 'https://artemismoon.io';

export function generateStaticParams() {
  return controlCentreArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }) {
  const article = getControlCentreArticle(params.slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/control-centre/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/control-centre/${article.slug}`,
      type: 'article',
      images: [article.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

function CtaLink({ href, children, variant = 'primary' }) {
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

export default function ControlCentreArticlePage({ params }) {
  const article = getControlCentreArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = controlCentreArticles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const articleUrl = `${siteUrl}/control-centre/${article.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: `${siteUrl}${article.image}`,
      datePublished: controlCentreUpdated,
      dateModified: controlCentreUpdated,
      mainEntityOfPage: articleUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Artemis Moon',
        url: siteUrl,
        logo: `${siteUrl}/artemis-moon-icon.svg`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Control Centre',
          item: `${siteUrl}/control-centre`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: articleUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#123f8a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_34%),linear-gradient(180deg,#123f8a_0%,#0b2560_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:34px_34px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/control-centre" className="inline-flex items-center text-sm font-semibold text-blue-50/80 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Control Centre
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <CtaLink href="/presale" variant="secondary">
                <Wallet className="mr-2 h-4 w-4" />
                Buy $ARMN
              </CtaLink>
              <CtaLink href="/calculator" variant="secondary">
                Calculator
              </CtaLink>
            </div>
          </header>

          <div className="grid gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <CalendarDays className="mr-2 h-4 w-4" />
                {article.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                {article.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50/75">
                {article.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink href="/presale">
                  View ARMN Presale
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CtaLink>
                <CtaLink href="/whitepaper" variant="secondary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Whitepaper
                </CtaLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-950/35 p-3 shadow-[0_24px_70px_rgba(2,6,23,0.35)]">
              <Image
                src={article.image}
                alt={article.imageAlt}
                width={1024}
                height={1024}
                priority
                className="aspect-[4/3] rounded-[1.5rem] object-cover"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                {article.quickFacts.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-blue-100/45">
                      {label}
                    </div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-blue-50">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10">
        <article className="space-y-6">
          {article.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-6 shadow-[0_18px_45px_rgba(2,6,23,0.16)] md:p-8"
            >
              <h2 className="text-2xl font-semibold text-white md:text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-blue-50/72">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[1.75rem] border border-cyan-200/20 bg-slate-950/45 p-6 md:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
              <Rocket className="h-4 w-4" />
              Launch window call-to-action
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-white">Do not wait for the countdown to go mainstream.</h2>
            <p className="mt-4 leading-8 text-blue-50/72">
              Artemis coverage can accelerate quickly around mission milestones. ARMN is designed to
              be onchain, verified and visible before the Moon narrative reaches peak attention. Read
              the whitepaper, use the calculator and visit the presale page before the next mission
              window gets louder.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href="/presale">
                Secure Presale Allocation
              </CtaLink>
              <CtaLink href="/calculator" variant="secondary">
                Run the Calculator
              </CtaLink>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/12 bg-white/[0.06] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {article.faqs.map(([question, answer]) => (
                <div key={question} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold text-blue-50">{question}</h3>
                  <p className="mt-2 leading-7 text-blue-50/68">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[1.75rem] border border-cyan-200/20 bg-slate-950/50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              NASA source links
            </div>
            <div className="mt-4 space-y-3">
              {article.nasaSources.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-blue-50/72 transition hover:border-cyan-200/30 hover:text-white"
                >
                  <span>{label}</span>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-5">
            <h2 className="text-lg font-semibold text-white">Related mission pages</h2>
            <div className="mt-4 space-y-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/control-centre/${related.slug}`}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-blue-50/72 transition hover:border-cyan-200/30 hover:text-white"
                >
                  {related.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-blue-300/20 bg-blue-500/10 p-5">
            <h2 className="text-lg font-semibold text-white">Independent project notice</h2>
            <p className="mt-3 text-sm leading-7 text-blue-50/65">
              Artemis Moon is an independent crypto project and is not affiliated with, endorsed by,
              or sponsored by NASA. ARMN can lose all value.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
