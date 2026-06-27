const siteUrl = 'https://artemismoon.io';
const lastModified = new Date('2026-06-23');

export default function sitemap() {
  return [
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
  ];
}
