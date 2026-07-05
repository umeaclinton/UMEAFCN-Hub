export async function sendToTelegram(title: string, contentPreview: string, sourceUrl: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    console.error('Missing Telegram credentials in env');
    return;
  }

  let chatId = channelId.trim();
  if (/^\d+$/.test(chatId)) {
    chatId = `-100${chatId}`;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  // Escape HTML characters to prevent breaking Telegram's parser
  const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const cleanPreview = escapeHtml(contentPreview.replace(/<[^>]+>/g, '').substring(0, 500)) + '...\n\nRead more on our website!';
  
  const message = `<b>${escapeHtml(title)}</b>\n\n${cleanPreview}\n\n🔗 Source: ${sourceUrl}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
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
