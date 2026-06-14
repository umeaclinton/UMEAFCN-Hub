const cheerio = require('cheerio');

async function testGoogleProxy() {
  const targetUrl = 'https://jobs.smartyacad.com/polaris-bank-technology-recruitment-2026/';
  const proxyUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl, {headers: {'User-Agent': 'Mozilla/5.0'}});
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('Preview:', html.substring(0, 500));
  } catch (err) {
    console.error('Error:', err);
  }
}

testGoogleProxy();
