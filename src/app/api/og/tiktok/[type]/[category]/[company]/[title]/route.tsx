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

    const bgUrl = new URL('/tiktok-bg.jpg', request.url).toString();

    if (type === 'cta') {
      imageElement = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          <img src={bgUrl} style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1920, objectFit: 'cover' }} />
          
          <div
            style={{
              position: 'absolute',
              top: '500px',
              left: '180px',
              right: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 80, fontWeight: 'bold', color: '#000', marginBottom: '60px' }}>
              Apply Immediately!
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 50, fontWeight: 'bold', color: '#000' }}>
              🔗 Link in bio
            </div>
          </div>
        </div>
      );
    } else {
      // Default: Job Details Slide
      const fullTitle = company ? `${title} at ${company}` : title;
      imageElement = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          <img src={bgUrl} style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1920, objectFit: 'cover' }} />
          
          <div
            style={{
              position: 'absolute',
              top: '400px',
              left: '160px',
              right: '160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 60, fontWeight: 'bold', color: '#111827', marginBottom: '50px' }}>
              Hiring ‼️
            </div>

            <div
              style={{
                fontSize: 55,
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.3,
                marginBottom: '70px',
                textAlign: 'center',
              }}
            >
              {fullTitle}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: 55, fontWeight: 'bold', color: '#111827', marginBottom: '60px' }}>
              Apply now 🔗 Link in bio
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: 55, fontWeight: 'bold', color: '#111827' }}>
              @umeafcnhub.online
            </div>
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
