import { NextResponse } from 'next/server';
import { sendToTikTok, checkTikTokStatus } from '@/lib/tiktok';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const title = "Test Job at Tech Corp";
    const company = "Tech Corp";
    const category = "Engineering";
    const description = "This is a test description for TikTok.";

    const result = await sendToTikTok(title, company, category, description);
    
    let statusResult = null;
    if (result.success && result.data?.data?.publish_id) {
      // Wait 15 seconds for TikTok to pull the images and process them
      await new Promise(resolve => setTimeout(resolve, 15000));
      statusResult = await checkTikTokStatus(result.data.data.publish_id);
    }
    
    return NextResponse.json({ success: true, initResult: result, statusResult });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
