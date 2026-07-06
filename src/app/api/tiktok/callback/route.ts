import { NextRequest, NextResponse } from 'next/server';
import { setSetting } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: 'OAuth failed', details: error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
  const REDIRECT_URI = 'https://www.umeafcnhub.online/api/tiktok/callback';

  if (!CLIENT_KEY || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'Missing TikTok credentials in environment' }, { status: 500 });
  }

  try {
    // Exchange the authorization code for an access token and refresh token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('TikTok Token Error:', tokenData);
      return NextResponse.json({ error: 'Failed to get token', details: tokenData }, { status: 400 });
    }

    const { refresh_token } = tokenData;

    if (refresh_token) {
      // Save the refresh token to our database so the cron job can use it indefinitely
      await setSetting('tiktok_refresh_token', refresh_token);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully authenticated with TikTok! The refresh token has been securely saved in the database. You can close this window.',
      });
    } else {
      return NextResponse.json({ error: 'No refresh token received' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('TikTok OAuth Exchange Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
