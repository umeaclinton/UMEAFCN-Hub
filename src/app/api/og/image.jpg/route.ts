import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // Forward all query parameters to the original OG route
    const ogUrl = new URL(url.toString().replace('/api/og/image.jpg', '/api/og'));
    
    const response = await fetch(ogUrl.toString());
    
    if (!response.ok) {
      return new NextResponse('Failed to fetch OG image', { status: response.status });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert PNG to JPEG
    const jpegBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    
    return new NextResponse(jpegBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error converting OG to JPEG:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
