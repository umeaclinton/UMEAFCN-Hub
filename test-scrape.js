const cheerio = require('cheerio');
async function run() {
  const url = 'https://jobs.smartyacad.com/polaris-bank-technology-recruitment-2026/';
  const res = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script, style, noscript, nav, header, footer, aside, .sidebar, #sidebar, .comments, #comments, svg').remove();
  let articleHtml = $('article').html() || $('main').html() || $('.post-content').html() || $('.entry-content').html();
  if (!articleHtml) articleHtml = $('body').html();
  console.log('Extracted HTML length:', articleHtml ? articleHtml.length : 0);
  console.log('Preview:', articleHtml ? articleHtml.substring(0, 200) : 'none');
}
run().catch(console.error);
