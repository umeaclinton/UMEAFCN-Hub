const Parser = require('rss-parser');
async function run() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://www.myjobmag.com/jobsxml_by_categories.xml');
    for (let i = 0; i < 5; i++) {
      console.log(`\n--- ITEM ${i} ---`);
      console.log('Title:', feed.items[i].title);
      console.log('Content snippet:', feed.items[i].content.substring(feed.items[i].content.length - 300));
    }
  } catch (e) {
    console.log('Failed:', e.message);
  }
}
run();
