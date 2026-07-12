import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';

export const runtime = 'nodejs'; // Must be Node.js to use sharp

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; category: string; company: string; title: string }> }
) {
  try {
    const resolvedParams = await params;
    const type = decodeURIComponent(resolvedParams.type);
    const category = decodeURIComponent(resolvedParams.category);
    const company = decodeURIComponent(resolvedParams.company);
    // Strip the .webp extension from the title
    const title = decodeURIComponent(resolvedParams.title).replace(/\.webp$/, '');

    // Generate the image JSX directly here - no internal HTTP fetch needed
    let imageElement: any;

    if (type === 'cta') {
      imageElement = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
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
      );
    } else {
      // Default: Job Details Slide
      imageElement = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#000000',
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
              boxShadow: '0 20px 40px rgba(255,255,255,0.1)',
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
                fontSize: 50,
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
                  fontSize: 35,
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
      );
    }

    // Generate PNG directly using ImageResponse (no internal HTTP fetch)
    const imageResponse = new ImageResponse(imageElement, {
      width: 1080,
      height: 1920,
    });

    // Convert the ImageResponse to a buffer
    const pngArrayBuffer = await imageResponse.arrayBuffer();
    const pngBuffer = Buffer.from(pngArrayBuffer);

    // Convert PNG → WebP using sharp (lossless=false gives smaller file with great quality)
    const webpBuffer = await sharp(pngBuffer)
      .webp({ quality: 90, lossless: false })
      .toBuffer();

    return new NextResponse(webpBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': webpBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating dynamic OG WebP image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
