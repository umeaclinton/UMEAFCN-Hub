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

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '30px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <div
              style={{
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                padding: '15px 30px',
                borderRadius: '30px',
                fontSize: 36,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '40px',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🏢 {company}
            </div>
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 40,
                fontWeight: 'bold',
                color: '#3b82f6',
              }}
            >
              @umeafcnhub
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
