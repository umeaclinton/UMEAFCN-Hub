import axios from 'axios';
import { getSetting } from './db';

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

export async function getAccessToken() {
  const refreshToken = await getSetting('tiktok_refresh_token');
  if (!refreshToken) {
    throw new Error('No TikTok refresh token found in settings');
  }

  const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', new URLSearchParams({
    client_key: CLIENT_KEY!,
    client_secret: CLIENT_SECRET!,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    }
  });

  if (response.data.error) {
    throw new Error(`Failed to refresh TikTok token: ${JSON.stringify(response.data)}`);
  }

  return response.data.access_token;
}

export async function checkTikTokStatus(publishId: string) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      publish_id: publishId
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}

export async function sendToTikTok(title: string, company: string, category: string, description: string) {
  try {
    const accessToken = await getAccessToken();

    // Construct image URLs that TikTok will pull
    const baseUrl = 'https://www.umeafcnhub.online/api/og/image.jpg';
    const params = new URLSearchParams({
      title: title.substring(0, 100),
      company: company.substring(0, 50),
      category: category.substring(0, 30)
    });
    
    const detailsImageUrl = `${baseUrl}?${params.toString()}&type=details`;
    const ctaImageUrl = `${baseUrl}?${params.toString()}&type=cta`;

    // Construct the caption
    const caption = `${title.substring(0, 50)}...\n\nApply via the link in our bio! 🔗\n#Hiring #Jobs #${category.replace(/[^a-zA-Z0-9]/g, '')}`.substring(0, 145);

    const requestBody = {
      post_info: {
        title: "New Job Opening",
        description: caption,
        privacy_level: "SELF_ONLY", // Set to Private initially for testing/audit compliance
        disable_comment: false
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_cover_index: 0,
        photo_images: [
          detailsImageUrl,
          ctaImageUrl
        ]
      },
      post_mode: "DIRECT_POST",
      media_type: "PHOTO"
    };

    const response = await axios.post('https://open.tiktokapis.com/v2/post/publish/content/init/', requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });

    if (response.data.error && response.data.error.code !== 'ok') {
      console.error('TikTok Direct Post Error:', response.data);
      return { success: false, error: response.data.error };
    }

    console.log(`Successfully posted to TikTok Photo Mode: ${title}`);
    return { success: true, data: response.data };

  } catch (error: any) {
    const errorDetail = error.response?.data || error.message;
    console.error('Error posting to TikTok:', errorDetail);
    return { success: false, error: errorDetail };
  }
}
