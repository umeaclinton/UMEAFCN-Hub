import Parser from 'rss-parser';
import { expandArticle } from './src/lib/gemini';

const parser = new Parser();

async function run() {
  console.log('Fetching feed...');
  const feedUrl = "https://www.myjobmag.com/jobsxml_by_categories.xml";
  const feed = await parser.parseURL(feedUrl);
  
  let count = 0;
  for (const entry of feed.items) {
    if (count >= 4) break;
    count++;
    
    const title = entry.title || '';
    const rawContent = entry.content || entry.contentSnippet || entry.summary || '';
    
    console.log(`\nProcessing Post ${count}: ${title}`);
    try {
      const expandedData = await expandArticle(title, rawContent);
      console.log('Result category:', expandedData.category);
      console.log('Is content HTML?:', expandedData.content.includes('<') && expandedData.content.includes('>') ? 'YES' : 'NO (Raw Text Block)');
    } catch (e: any) {
      console.error('Fatal Error:', e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

run().catch(console.error);
