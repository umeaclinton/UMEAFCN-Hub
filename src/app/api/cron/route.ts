import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Parser from 'rss-parser';
import axios from 'axios';
import { initDb, getPostByHash, insertPost } from '@/lib/db';
import { paraphraseText, paraphraseHtml, expandArticle } from '@/lib/gemini';
import { sendToTelegram } from '@/lib/telegram';
import * as cheerio from 'cheerio';
import { scrapeMyJobMagApplicationMethod } from '@/lib/scraper';

// Configure feeds here
const FEEDS = [
  "https://www.myjobmag.com/jobsxml_by_categories.xml"
];

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

function computeHash(guid: string, title: string) {
  const data = `${guid}_${title}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

// Allow Vercel to cache and revalidate or just mark as dynamic
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow 5 minutes execution time for free tier

export async function GET(request: Request) {
  try {
    // Check auth header if you want to secure the cron job endpoint (Vercel provides a CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // For local testing, we might bypass this if CRON_SECRET is not set
      if (process.env.NODE_ENV === 'production') {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    console.log('Starting RSS feed monitor...');
    
    // Ensure DB exists
    await initDb();
    
    let processedCount = 0;
    let newPostsCount = 0;
    let apiCallsCount = 0;
    const MAX_POSTS_PER_RUN = 4; // Gemini Free Tier strict limit is 5 Requests Per Minute!

    for (const feedUrl of FEEDS) {
      console.log(`Fetching feed: ${feedUrl}`);
      let feedXml: string;
      try {
        feedXml = await fetchFeedXmlWithRetry(feedUrl);
      } catch (err: any) {
        console.error(`Failed to retrieve feed XML for ${feedUrl}:`, err.message);
        continue;
      }

      console.log(`Parsing feed XML for: ${feedUrl}`);
      const feed = await parser.parseString(feedXml);
      
      for (const entry of feed.items) {
        if (newPostsCount >= MAX_POSTS_PER_RUN || apiCallsCount >= 5) {
          console.log(`Reached max posts per run (${MAX_POSTS_PER_RUN}) or API calls (${apiCallsCount}). Stopping to avoid API limits.`);
          break;
        }

        processedCount++;
        const guid = entry.guid || entry.id || entry.link || '';
        const title = entry.title || '';
        
        const guidHash = computeHash(guid, title);
        
        // Check duplicate
        const existing = await getPostByHash(guidHash);
        if (existing) {
          continue; // Skip duplicate
        }
        
        console.log(`New post found: ${title}`);
        
        let rawContent = entry.content || entry.contentSnippet || entry.summary || '';
        
        // Scrape application method if available
        if (entry.link) {
          try {
            const scrapedMethod = await scrapeMyJobMagApplicationMethod(entry.link);
            if (scrapedMethod) {
              console.log(`Successfully scraped application method for: ${title}`);
              rawContent += `\n\nMethod of Application:\n${scrapedMethod}`;
            } else {
              console.log(`No application method scraped for: ${title}`);
            }
          } catch (scrapeErr: any) {
            console.error(`Failed to scrape application method for ${title}:`, scrapeErr.message || scrapeErr);
          }
        }

        // Expand the short RSS summary into a full article using Gemini
        const expandedData = await expandArticle(title, rawContent);
        apiCallsCount++;
        
        // Generate slug
        const slug = generateSlug(title);
        
        // Store
        await insertPost(
          title, 
          expandedData.content, 
          entry.link || feedUrl, 
          guidHash,
          slug,
          expandedData.category,
          expandedData.apply_type,
          expandedData.apply_link
        );
        
        // Only notify and count as "new post" if there is a valid application method (email or URL)
        if (expandedData.apply_type !== 'none' && expandedData.apply_link) {
          newPostsCount++;
          // Telegram Notify
          await sendToTelegram(title, expandedData.content, entry.link || feedUrl);
        } else {
          console.log(`Skipped publishing/Telegram notification for post "${title}" because apply_type is 'none'.`);
        }
        
        // Add a 2-second delay to prevent hitting Gemini's burst rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: processedCount, 
      newPosts: newPostsCount,
      message: 'Feeds processed successfully.'
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
