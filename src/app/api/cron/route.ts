import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Parser from 'rss-parser';
import { initDb, getPostByHash, insertPost } from '@/lib/db';
import { paraphraseText, paraphraseHtml, expandArticle } from '@/lib/gemini';
import { sendToTelegram } from '@/lib/telegram';
import * as cheerio from 'cheerio';

// Configure feeds here
const FEEDS = [
  "https://www.myjobmag.com/jobsxml_by_categories.xml"
];

const parser = new Parser();

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
    const MAX_POSTS_PER_RUN = 3; // Gemini Free Tier limits to 15 Requests Per Minute

    for (const feedUrl of FEEDS) {
      console.log(`Fetching feed: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      for (const entry of feed.items) {
        if (newPostsCount >= MAX_POSTS_PER_RUN) {
          console.log(`Reached max posts per run (${MAX_POSTS_PER_RUN}). Stopping to avoid API limits.`);
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
        
        // Expand the short RSS summary into a full article using Gemini
        const newTitle = await paraphraseText(title);
        const expandedData = await expandArticle(title, rawContent);
        
        // Generate slug
        const slug = generateSlug(newTitle || title);
        
        // Store
        await insertPost(
          newTitle || title, 
          expandedData.content, 
          entry.link || feedUrl, 
          guidHash,
          slug,
          expandedData.category,
          expandedData.apply_type,
          expandedData.apply_link
        );
        newPostsCount++;
        
        // Telegram Notify
        await sendToTelegram(newTitle || title, expandedData.content, entry.link || feedUrl);
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
