import { TwitterApi } from 'twitter-api-v2';

export async function sendToTwitter(title: string, contentPreview: string, sourceUrl: string) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('Missing Twitter credentials in env');
    return;
  }

  // Initialize Twitter client
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const rwClient = client.readWrite;

  // Format Tweet (max 280 chars)
  // Twitter automatically shortens URLs to 23 chars, but we'll be safe
  const hashtags = "\n\n#Hiring #Jobs\n\n";
  
  let cleanTitle = title;
  // Estimate length: Title + hashtags + URL
  // We trim title if it's too long
  const fixedLength = hashtags.length + sourceUrl.length;
  if (cleanTitle.length + fixedLength > 275) {
      cleanTitle = cleanTitle.substring(0, 275 - fixedLength) + '...';
  }
  
  const message = `${cleanTitle}${hashtags}${sourceUrl}`;

  try {
    const { data: createdTweet } = await rwClient.v2.tweet(message);
    console.log('Successfully sent message to Twitter:', createdTweet.id);
  } catch (error) {
    console.error('Failed to send Twitter message:', error);
  }
}
