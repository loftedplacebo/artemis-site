import { controlCentreArticles } from './control-centre/missionContent';

const siteUrl = 'https://artemismoon.io';
const lastModified = new Date('2026-06-28');

export default function sitemap() {
  const staticRoutes = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/presale`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/whitepaper`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/calculator`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [
        `${siteUrl}/images/calculator/moon-rock.png`,
        `${siteUrl}/images/calculator/moon-buggy.png`,
        `${siteUrl}/images/calculator/spaceplane.png`,
        `${siteUrl}/images/calculator/private-rocket.png`,
      ],
    },
    {
      url: `${siteUrl}/game`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
      images: [`${siteUrl}/social-card.png`],
    },
  ];

  const controlCentreRoutes = [
    {
      url: `${siteUrl}/control-centre`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${siteUrl}/images/calculator/private-rocket.png`],
    },
    ...controlCentreArticles.map((article) => ({
      url: `${siteUrl}/control-centre/${article.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: article.priority,
      images: [`${siteUrl}${article.image}`],
    })),
  ];

  return [...staticRoutes, ...controlCentreRoutes];
}
