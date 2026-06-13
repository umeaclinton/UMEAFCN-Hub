export async function sendToTelegram(title: string, contentPreview: string, sourceUrl: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    console.error('Missing Telegram credentials in env');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  // Clean preview text
  const cleanPreview = contentPreview.replace(/<[^>]+>/g, '').substring(0, 500) + '...\n\nRead more on our website!';
  
  const message = `🌟 *${title}*\n\n${cleanPreview}\n\n🔗 Source: ${sourceUrl}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', errorText);
    } else {
      console.log('Successfully sent message to Telegram');
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
