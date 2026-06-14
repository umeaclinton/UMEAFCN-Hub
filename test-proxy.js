const cheerio = require('cheerio');

async function testAllOrigins() {
  const targetUrl = 'https://jobs.smartyacad.com/polaris-bank-technology-recruitment-2026/';
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    console.log('Status:', res.status);
    const html = await res.text();
    
    if (html.length < 1000) {
      console.log('HTML too short, proxy might be blocked:', html);
      return;
    }
    
    const $ = cheerio.load(html);
    $('script, style, noscript, nav, header, footer, aside, .sidebar, #sidebar, .comments, #comments, svg').remove();
    let articleHtml = $('.elementor-widget-theme-post-content').html() || $('.entry-content').html() || $('.post-content').html() || $('article').html() || $('main').html();
    
    console.log('Extracted HTML length:', articleHtml ? articleHtml.length : 0);
  } catch (err) {
    console.error('Error:', err);
  }
}

testAllOrigins();
