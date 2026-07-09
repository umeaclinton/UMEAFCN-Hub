const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('asa.html', 'utf8');
const $ = cheerio.load(html);

const links = [];
$('a').each((i, el) => {
  const text = $(el).text().toLowerCase();
  if (text.includes('apply') || text.includes('here')) {
    links.push({
      text: $(el).text().trim(),
      href: $(el).attr('href')
    });
  }
});

console.log(links);
