import Parser from 'rss-parser';

const parser = new Parser();

async function run() {
  const feedUrl = "https://www.myjobmag.com/jobsxml_by_categories.xml";
  const feed = await parser.parseURL(feedUrl);
  
  const entry = feed.items[0];
  const rawContent = entry.content || entry.contentSnippet || entry.summary || '';
  
  console.log("TITLE:", entry.title);
  console.log("LINK:", entry.link);
  console.log("GUID:", entry.guid);
  console.log("\nRAW CONTENT:\n", rawContent);
}

run().catch(console.error);
