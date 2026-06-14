import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Parser from 'rss-parser';
import { initDb, getPostByHash, insertPost } from '@/lib/db';
import { paraphraseText, paraphraseHtml } from '@/lib/gemini';
import { sendToTelegram } from '@/lib/telegram';
import * as cheerio from 'cheerio';

// Configure feeds here
const FEEDS = [
  "https://jobs.smartyacad.com/feed/"
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

    for (const feedUrl of FEEDS) {
      console.log(`Fetching feed: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      for (const entry of feed.items) {
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
        
        // --- NEW SCRAPING LOGIC ---
        // Fetch the full article HTML from the URL if it exists
        if (entry.link) {
          try {
            console.log(`Fetching full article from: ${entry.link}`);
            const response = await fetch(entry.link, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Upgrade-Insecure-Requests': '1',
              },
            });
            const htmlString = await response.text();
            
            // Parse HTML with cheerio to extract main content
            const $ = cheerio.load(htmlString);
            
            // Remove unnecessary elements
            $('script, style, noscript, nav, header, footer, aside, .sidebar, #sidebar, .comments, #comments, svg').remove();
            
            // Find the most likely main article container (especially for Elementor sites)
            let articleHtml = $('.elementor-widget-theme-post-content').html() || $('.entry-content').html() || $('.post-content').html() || $('article').html() || $('main').html();
            
            // Fallback to body if no semantic container is found
            if (!articleHtml) {
              articleHtml = $('body').html();
            }
            
            if (articleHtml) {
              console.log('Successfully extracted full article body using Cheerio!');
              rawContent = articleHtml;
            } else {
              console.log('Could not extract article body, falling back to RSS summary.');
            }
          } catch (fetchErr) {
            console.error(`Failed to fetch full article from ${entry.link}:`, fetchErr);
          }
        }
        // --------------------------

        // Paraphrase
        const newTitle = await paraphraseText(title);
        const newContent = await paraphraseHtml(rawContent);
        
        // Generate slug
        const slug = generateSlug(newTitle || title);
        
        // Store
        await insertPost(
          newTitle || title, 
          newContent || rawContent, 
          entry.link || feedUrl, 
          guidHash,
          slug
        );
        newPostsCount++;
        
        // Telegram Notify
        await sendToTelegram(newTitle || title, newContent || rawContent, entry.link || feedUrl);
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
