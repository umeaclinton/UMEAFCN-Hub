import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(
  request: NextRequest, 
  { params }: { params: { type: string, category: string, company: string, title: string } }
) {
  try {
    // URL decode the path parameters
    const type = decodeURIComponent(params.type);
    const category = decodeURIComponent(params.category);
    const company = decodeURIComponent(params.company);
    // The title parameter will contain '.jpg', so we remove it
    const title = decodeURIComponent(params.title).replace(/\.jpg$/, '');
    
    // Construct internal URL to fetch from our existing /api/og route
    const internalOgUrl = new URL(request.url);
    internalOgUrl.pathname = '/api/og';
    internalOgUrl.search = ''; // Clear all query params
    internalOgUrl.searchParams.set('type', type);
    internalOgUrl.searchParams.set('category', category);
    internalOgUrl.searchParams.set('company', company);
    internalOgUrl.searchParams.set('title', title);
    
    const response = await fetch(internalOgUrl.toString());
    
    if (!response.ok) {
      return new NextResponse('Failed to fetch internal OG image', { status: response.status });
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
    console.error('Error converting dynamic OG to JPEG:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
