import { getRecentPosts } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

const SITE_URL = 'https://umeafcnhub.online';
const SITE_NAME = 'UMEAFCN Hub';
const SITE_DESCRIPTION = 'Curated internships, scholarships, and graduate trainee programs in Nigeria and Africa.';

function buildOgImageUrl(post: any): string {
  const type = encodeURIComponent(post.apply_type || 'job');
  const category = encodeURIComponent(post.category || 'General');
  const company = encodeURIComponent(post.company_name || 'UMEAFCN Hub');
  const title = encodeURIComponent(post.title?.substring(0, 60) || 'Opportunity');
  // Changed path to /api/og/tiktok/ to permanently bust old caches (since dlvr.it ignores query parameters)
  return `${SITE_URL}/api/og/tiktok/${type}/${category}/${company}/${title}?.png`;
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const posts = await getRecentPosts(50, 0);

    const items = posts.map((post: any) => {
      const postUrl = `${SITE_URL}/post/${post.slug || post.id}`;
      const imageUrl = buildOgImageUrl(post);
      const excerpt = post.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.pub_date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category || 'General')}</category>
      <description>${escapeXml(excerpt)}...</description>
      <imageurl>${imageUrl}</imageurl>
      <enclosure url="${imageUrl}" type="image/png" length="0"/>
      <media:content url="${imageUrl}" medium="image" type="image/png"/>
      <media:thumbnail url="${imageUrl}"/>
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo-light.jpg</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
