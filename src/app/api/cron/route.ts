import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Parser from 'rss-parser';
import axios from 'axios';
import { initDb, getPostByHash, insertPost, insertBlogPost, sql } from '@/lib/db';
import { expandArticle } from '@/lib/gemini';
import { sendToTelegram } from '@/lib/telegram';
import { scrapeMyJobMagApplicationMethod } from '@/lib/scraper';
import { GoogleGenAI } from '@google/genai';
// Removed @vercel/postgres, now imported from @/lib/db directly if needed

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

// Helper to generate dynamic, high-quality, long-form career advice articles using Gemini
async function createLongFormBlogArticle(existingTitles: string[]): Promise<{ title: string; excerpt: string; content: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Write a detailed, comprehensive, and highly engaging career advice article (at least 800 - 1200 words).
The article must cover a unique, specific topic related to job search, CV writing, ATS scanners, interview preparation, career transition, salary negotiation, remote work, or career growth in Africa and globally.

IMPORTANT: The topic MUST be completely different from these existing articles on our site:
${existingTitles.map(t => `- ${t}`).join('\n')}

Structure the output using clean, professional HTML tags (<h3> for section headers, <p> for paragraphs, <ul> and <li> for lists, <strong> for emphasis). Do NOT wrap the output in a <html>, <head>, or <body> tag.
Provide highly practical advice, real-world examples, and actionable templates or checklists. Make it look like a complete, fully detailed and engaging article.

You MUST return the output EXACTLY as a valid JSON object with three keys:
"title": "A compelling, clickable headline",
"excerpt": "A short, professional summary of the article (150-180 characters) suitable for list views",
"content": "The full-length HTML article content (800-1200 words)"

Example JSON structure:
{
  "title": "Unlocking Remote Work in 2026...",
  "excerpt": "Discover the latest tips to stand out...",
  "content": "<h3>Introduction</h3><p>Detailed paragraphs...</p>"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  let text = response.text || '{}';
  text = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
  const parsed = JSON.parse(text);

  if (!parsed.title || !parsed.content) {
    throw new Error('Invalid JSON format returned from Gemini for blog article');
  }

  return {
    title: parsed.title,
    excerpt: parsed.excerpt || 'Read our latest professional career guides and checklists.',
    content: parsed.content
  };
}

// Timezone WAT (UTC+1) check and automated article publishing
async function handleAutomatedBlogGeneration() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const watTime = new Date(utc + (3600000 * 1)); // UTC+1
  const currentHour = watTime.getHours();
  
  const TRIGGER_HOURS = [8, 10, 14, 16]; // 8am, 10am, 2pm, 4pm
  if (!TRIGGER_HOURS.includes(currentHour)) {
    console.log(`[Blog Generator] WAT time is ${watTime.toLocaleString()}. Current hour (${currentHour}) is not a trigger hour (8, 10, 14, 16). Skipping.`);
    return;
  }

  // Check duplicate runs inside the same trigger window (90 minutes)
  const checkRecent = await sql`
    SELECT id FROM blog_posts 
    WHERE pub_date > NOW() - INTERVAL '90 minutes' 
    LIMIT 1;
  `;
  if (checkRecent.rows.length > 0) {
    console.log(`[Blog Generator] Blog post already generated in the last 90 minutes. Skipping.`);
    return;
  }

  console.log(`[Blog Generator] Trigger hour ${currentHour} WAT hit! Running automated generation...`);

  // Query existing titles to prevent duplicates
  const existingBlogs = await sql`SELECT title FROM blog_posts ORDER BY pub_date DESC LIMIT 15;`;
  const existingTitles = existingBlogs.rows.map(r => r.title);

  // Generate article
  const blogData = await createLongFormBlogArticle(existingTitles);
  
  // Generate a safe unique slug
  let baseSlug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  if (!baseSlug) baseSlug = 'career-guide';
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;

  await insertBlogPost(blogData.title, slug, blogData.content, blogData.excerpt, 'Clinton');
  console.log(`[Blog Generator] Successfully published automated blog post: "${blogData.title}"`);
  
  // Post to Telegram
  const sourceUrl = `https://jobswithclinton.vercel.app/blog/${slug}`;
  await sendToTelegram(blogData.title, blogData.excerpt, sourceUrl);
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

    // Trigger automated WAT-based blog generation
    try {
      await handleAutomatedBlogGeneration();
    } catch (blogErr: any) {
      console.error('Error handling automated blog generation:', blogErr.message || blogErr);
    }
    
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
          const sourceUrl = `https://jobswithclinton.vercel.app/post/${slug}`;
          await sendToTelegram(title, expandedData.content, sourceUrl);
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
