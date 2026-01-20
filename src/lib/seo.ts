import { Metadata } from 'next';
import { siteMetadata } from '@/config/routes';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export function generateMetadata({
  title,
  description = siteMetadata.description,
  keywords = siteMetadata.keywords,
  image = siteMetadata.image,
  path = '',
  type = 'website',
  publishedTime,
  author = siteMetadata.author,
}: GenerateMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteMetadata.title}` : siteMetadata.title;
  const url = `${siteMetadata.siteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: siteMetadata.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteMetadata.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteMetadata.title,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' && publishedTime && {
        publishedTime,
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      // Accessibility: include alt text for Twitter image previews
      imageAlt: title || siteMetadata.title,
      creator: siteMetadata.twitterHandle,
      site: siteMetadata.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

export function generateBlogPostMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: { name: string };
  featuredImage?: string;
  tags?: string[];
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    image: post.featuredImage,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    author: post.author.name,
  });
}

export const seo = {
  generateMetadata,
  generateBlogPostMetadata,
};