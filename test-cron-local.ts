import { loadEnvConfig } from '@next/env';
// Load Next.js environment variables before importing other modules
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import Parser from 'rss-parser';
import axios from 'axios';
import { expandArticle } from './src/lib/gemini';
import { scrapeMyJobMagApplicationMethod } from './src/lib/scraper';

const parser = new Parser();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFeedXmlWithRetry(url: string, retries = 3, delayMs = 2000): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Feed Fetch] Attempt ${i + 1} of ${retries} to fetch RSS...`);
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/xml, text/xml, */*',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 15000
      });
      return res.data;
    } catch (err: any) {
      console.warn(`[Feed Fetch] Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) {
        throw err;
      }
      await delay(delayMs * (i + 1));
    }
  }
  throw new Error("Failed to fetch feed XML after all retries");
}

async function run() {
  console.log('Fetching feed...');
  const feedUrl = "https://www.myjobmag.com/jobsxml_by_categories.xml";
  let feedXml: string;
  try {
    feedXml = await fetchFeedXmlWithRetry(feedUrl);
  } catch (err: any) {
    console.error("Failed to retrieve feed XML:", err.message);
    return;
  }

  console.log('Parsing feed XML...');
  const feed = await parser.parseString(feedXml);
  
  let count = 0;
  for (const entry of feed.items) {
    if (count >= 2) break; // Test with 2 items to save Gemini quota
    count++;
    
    const title = entry.title || '';
    let rawContent = entry.content || entry.contentSnippet || entry.summary || '';
    const link = entry.link || '';
    
    console.log(`\n=============================================`);
    console.log(`Processing Post ${count}: ${title}`);
    console.log(`Link: ${link}`);
    
    let scrapedMethod: string | null = null;
    if (link) {
      scrapedMethod = await scrapeMyJobMagApplicationMethod(link);
      if (scrapedMethod) {
        console.log(`Successfully scraped application method (${scrapedMethod.length} chars)`);
        rawContent += `\n\nMethod of Application:\n${scrapedMethod}`;
      } else {
        console.log(`No application method scraped.`);
      }
    }
    
    try {
      console.log('Sending to Gemini for expansion...');
      const expandedData = await expandArticle(title, rawContent);
      console.log('\n--- GEMINI RESPONSE ---');
      console.log('Result category:', expandedData.category);
      console.log('Apply Type:', expandedData.apply_type);
      console.log('Apply Link:', expandedData.apply_link);
      console.log('Is content HTML?:', expandedData.content.includes('<') && expandedData.content.includes('>') ? 'YES' : 'NO (Raw Text Block)');
      console.log('\nContent Sample (Last 500 chars):\n', expandedData.content.substring(expandedData.content.length - 500));
    } catch (e: any) {
      console.error('Fatal Error:', e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

run().catch(console.error);
