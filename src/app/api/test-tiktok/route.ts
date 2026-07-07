import { NextResponse } from 'next/server';
import { sendToTikTok } from '@/lib/tiktok';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const title = "Test Job at Tech Corp";
    const company = "Tech Corp";
    const category = "Engineering";
    const description = "This is a test description for TikTok.";

    const result = await sendToTikTok(title, company, category, description);
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
