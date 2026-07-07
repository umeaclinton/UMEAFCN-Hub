import { config } from 'dotenv';
config({ path: '.env.local' });

import { sendToTikTok } from './src/lib/tiktok';

async function testTikTok() {
  console.log('Starting TikTok Direct Post Test...');
  
  const title = "Software Engineer at Google";
  const company = "Google";
  const category = "Tech";
  const description = "We are looking for an amazing Software Engineer to join our team in London! Great benefits, remote work available.";
  
  try {
    const success = await sendToTikTok(title, company, category, description);
    if (success) {
      console.log('✅ Successfully posted test photo to TikTok!');
    } else {
      console.log('❌ Failed to post test photo to TikTok.');
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

testTikTok().then(() => process.exit(0));
