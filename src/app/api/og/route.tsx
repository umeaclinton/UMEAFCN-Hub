import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'details';
    const title = searchParams.get('title') || 'New Opportunity Available';
    const company = searchParams.get('company') || 'UMEAFCN Hub';
    const category = searchParams.get('category') || 'Careers';

    if (type === 'cta') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              color: 'white',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <div style={{ fontSize: 80, fontWeight: 'bold', color: '#38bdf8', marginBottom: 20 }}>
              Apply Immediately!
            </div>
            <div style={{ fontSize: 40, color: '#e2e8f0', marginBottom: 40 }}>
              This role could close at any time.
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 'bold',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '20px 60px',
                borderRadius: '40px',
                border: '4px solid #60a5fa',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🔗 Link in Bio
            </div>
          </div>
        ),
        {
          width: 1080,
          height: 1920, // TikTok ratio (9:16)
        }
      );
    }

    // Default: Job Details Slide
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
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: 30,
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

            <div style={{ display: 'flex', alignItems: 'center' }}>
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
            </div>
          </div>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 'bold',
              color: '#94a3b8',
            }}
          >
            UMEAFCN Hub | @umeafcnhub
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
