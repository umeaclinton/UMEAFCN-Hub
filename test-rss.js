const Parser = require('rss-parser');
async function run() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://jobs.smartyacad.com/feed/');
  console.log(feed.items[0]);
}
run();
