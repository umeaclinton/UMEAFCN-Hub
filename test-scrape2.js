const cheerio = require('cheerio');
async function run() {
  const url = 'https://jobs.smartyacad.com/polaris-bank-technology-recruitment-2026/';
  const res = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const content = $('.elementor-widget-theme-post-content').html() || $('.elementor-post__content').html() || $('.entry-content').html();
  
  if (content) {
     console.log('Found content:', content.length, 'chars');
     console.log(content.substring(0, 300));
  } else {
     console.log('Could not find elementor content');
     // let's try to find paragraphs
     console.log('Paragraphs:', $('p').length);
     let pText = '';
     $('p').each((i, el) => { pText += $(el).text() + '\n'; });
     console.log('Ptext length:', pText.length);
     console.log(pText.substring(0, 300));
  }
}
run().catch(console.error);
