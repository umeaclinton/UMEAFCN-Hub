import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const REDIRECT_URI = 'https://www.umeafcnhub.online/api/tiktok/callback';
  
  if (!CLIENT_KEY) {
    return NextResponse.json({ error: 'Missing TikTok Client Key' }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(7);
  
  // Set up the OAuth URL
  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.append('client_key', CLIENT_KEY);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'video.upload,video.publish,user.info.basic');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);

  return NextResponse.redirect(authUrl.toString());
}
