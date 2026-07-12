import { ImageResponse } from 'next/og';
import { getPostBySlug, getPostById } from '@/lib/db';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = 'Job Opportunity';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  let post = null;

  try {
    post = await getPostBySlug(identifier);
    if (!post && !isNaN(parseInt(identifier, 10))) {
      post = await getPostById(parseInt(identifier, 10));
    }
  } catch (err) {
    console.error("Error generating opengraph image for", identifier, err);
  }

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white', fontSize: 60 }}>
          Post Not Found
        </div>
      ),
      { ...size }
    );
  }

  const category = post.category || 'General';
  const title = post.title?.substring(0, 100) || 'Opportunity';
  const company = 'UMEAFCN Hub';

  const bgUrl = new URL('/tiktok-bg.jpg', 'https://www.umeafcnhub.online').toString();
  const fullTitle = post.company_name ? `${title} at ${post.company_name}` : title;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden'
        }}
      >
        <img src={bgUrl} style={{ position: 'absolute', top: '-600px', left: 0, width: '1200px', height: '2133px', objectFit: 'cover' }} />
        
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '200px',
            right: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 45, fontWeight: 'bold', color: '#111827', marginBottom: '40px' }}>
            Hiring ‼️
          </div>

          <div
            style={{
              fontSize: 45,
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.3,
              marginBottom: '50px',
              textAlign: 'center',
            }}
          >
            {fullTitle}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 'bold', color: '#111827', marginBottom: '40px' }}>
            Apply now 🔗 Link in bio
          </div>

          <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 'bold', color: '#111827' }}>
            @umeafcnhub.online
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
