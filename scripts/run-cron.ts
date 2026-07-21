/**
 * Standalone Cron Script for GitHub Actions
 * 
 * This script replicates the logic from /api/cron/route.ts
 * but runs as a plain Node.js script using tsx.
 * 
 * Run manually: npx tsx scripts/run-cron.ts
 * Triggered automatically by: .github/workflows/cron.yml
 */

// Load .env.local for local testing (GitHub Actions injects env vars directly)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import crypto from 'crypto';
import Parser from 'rss-parser';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { neon } from '@neondatabase/serverless';

// ─── Database Setup ───────────────────────────────────────────────────────────
const neonSql = neon(process.env.DATABASE_URL!);
const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await neonSql(strings, ...values);
  return { rows: result, rowCount: result.length };
};

// ─── RSS Feeds to Process ─────────────────────────────────────────────────────
const FEEDS = [
  "https://www.myjobmag.com/jobsxml_by_categories.xml",
  "https://www.afterschoolafrica.com/category/scholarships/feed/",
  "https://www.afterschoolafrica.com/category/graduate-trainee/feed/",
  "https://www.afterschoolafrica.com/category/internships/feed/"
];

const MAX_POSTS_PER_RUN = 4;
const parser = new Parser();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function computeHash(guid: string, title: string) {
  return crypto.createHash('sha256').update(`${guid}_${title}`).digest('hex');
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

// ─── Database Helpers ─────────────────────────────────────────────────────────
async function getPostByHash(guidHash: string) {
  const result = await sql`SELECT id FROM posts WHERE guid_hash = ${guidHash} LIMIT 1;`;
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function insertPost(title: string, content: string, sourceUrl: string, guidHash: string, slug: string, category: string = 'General', applyType: string = 'none', applyLink: string | null = null) {
  const result = await sql`
    INSERT INTO posts (title, content, source_url, guid_hash, slug, category, apply_type, apply_link)
    VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug}, ${category}, ${applyType}, ${applyLink})
    ON CONFLICT (guid_hash) DO NOTHING
    RETURNING id, title, slug, pub_date;
  `;
  return result.rows[0];
}

async function insertBlogPost(title: string, slug: string, content: string, excerpt: string, author: string = 'Clinton') {
  const result = await sql`
    INSERT INTO blog_posts (title, slug, content, excerpt, author)
    VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${author})
    ON CONFLICT (slug) DO UPDATE 
    SET title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt
    RETURNING id, title, slug;
  `;
  return result.rows[0];
}

// ─── Gemini AI ────────────────────────────────────────────────────────────────
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];

async function expandArticle(title: string, summary: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Write a detailed, comprehensive, and professional blog post expanding on the following job listing summary. 
Format the output using clean HTML (e.g., <p>, <ul>, <li>, <h3>, <strong>). Do not include <html>, <head>, or <body> tags. 
Keep a professional, encouraging tone suitable for a job board. Do not add fake links.

IMPORTANT: Always explicitly include the "Method of Application" instructions at the very end of your generated HTML content.

Additionally, assign a single category. Choose from: 'Internships', 'Graduate Programs', 'Scholarships', 'Bootcamps', 'Grants', or job functions (e.g. 'Tech', 'Finance', 'Engineering', 'Marketing').

Return EXACTLY as valid JSON with four keys: "category", "content", "apply_type", and "apply_link".

Application Rules:
1. If CV/Resume goes to an email, set "apply_type" to "email" and "apply_link" to the email.
2. If there is a direct external portal link, set "apply_type" to "url" and "apply_link" to that URL.
3. If no clear method, set "apply_type" to "none" and "apply_link" to null.

Title: ${title}
Summary: ${summary}`,
        config: { responseMimeType: "application/json" }
      });

      let text = (response.text || '{}').replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(text);
      return {
        category: parsed.category || 'General',
        content: parsed.content || summary,
        apply_type: parsed.apply_type || 'none',
        apply_link: parsed.apply_link || null
      };
    } catch (error: any) {
      if (error.status === 429) {
        console.warn(`Rate limit on ${modelName}, trying next...`);
        continue;
      }
      console.error(`Error with ${modelName}:`, error.message);
    }
  }
  return { category: 'General', content: summary, apply_type: 'none', apply_link: null };
}

async function generateBlogArticle(existingTitles: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Write a detailed, engaging career advice article (800-1200 words).
Topic must be completely different from these existing articles:
${existingTitles.map(t => `- ${t}`).join('\n')}

Use clean HTML tags (<h3>, <p>, <ul>, <li>, <strong>). No <html>/<head>/<body> tags.

Return EXACTLY as JSON with keys: "title", "excerpt" (150-180 chars), "content" (HTML).`;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      let text = (response.text || '{}').replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(text);
      if (!parsed.title || !parsed.content) throw new Error('Invalid JSON from Gemini');
      return { title: parsed.title, excerpt: parsed.excerpt || 'Read our latest career guides.', content: parsed.content };
    } catch (error: any) {
      if (error.status === 429) { console.warn(`Rate limit on ${modelName}`); continue; }
      console.error(`Blog gen error with ${modelName}:`, error.message);
    }
  }
  throw new Error('Failed to generate blog article after all model attempts.');
}

// ─── Social Posting ───────────────────────────────────────────────────────────
async function sendToTelegram(title: string, content: string, url: string) {
  try {
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);
    const message = `📢 *${title}*\n\n${plainText}...\n\n🔗 [View Full Details & Apply](${url})\n\n📣 Join our channel for more opportunities: @umeafcnhub`;
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });
    console.log(`[Telegram] Sent: ${title}`);
  } catch (err: any) {
    console.error('[Telegram] Error:', err.message);
  }
}

async function sendToTwitter(title: string, content: string, url: string) {
  try {
    const { TwitterApi } = await import('twitter-api-v2');
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const maxTitleLength = 100;
    const shortenedTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength) + '...' : title;
    const tweet = `🚀 ${shortenedTitle}\n\n🔗 Apply: ${url}\n\n#Jobs #Career #Opportunities #Nigeria`;
    await client.v2.tweet(tweet);
    console.log(`[Twitter] Sent: ${title}`);
  } catch (err: any) {
    console.error('[Twitter] Error:', err.message);
  }
}

// ─── Blog Auto-Generation (WAT Time Check) ────────────────────────────────────
async function handleBlogGeneration() {
  const now = new Date();
  const watHour = new Date(now.getTime() + 3600000).getUTCHours(); // UTC+1 = WAT
  const TRIGGER_HOURS = [7, 9, 13, 15]; // 8am, 10am, 2pm, 4pm WAT

  if (!TRIGGER_HOURS.includes(watHour)) {
    console.log(`[Blog] WAT hour ${watHour + 1} is not a trigger hour. Skipping.`);
    return;
  }

  // Check if blog was posted in the last 90 minutes
  const checkRecent = await sql`SELECT id FROM blog_posts WHERE pub_date > NOW() - INTERVAL '90 minutes' LIMIT 1;`;
  if (checkRecent.rows.length > 0) {
    console.log('[Blog] Already posted in last 90 minutes. Skipping.');
    return;
  }

  console.log(`[Blog] Trigger hour hit! Generating article...`);
  const existingBlogs = await sql`SELECT title FROM blog_posts ORDER BY pub_date DESC LIMIT 15;`;
  const existingTitles = existingBlogs.rows.map((r: any) => r.title);

  const blogData = await generateBlogArticle(existingTitles);
  let baseSlug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  if (!baseSlug) baseSlug = 'career-guide';
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;

  await insertBlogPost(blogData.title, slug, blogData.content, blogData.excerpt);
  console.log(`[Blog] Published: "${blogData.title}"`);

  const sourceUrl = `https://www.umeafcnhub.online/blog/${slug}`;
  await sendToTelegram(blogData.title, blogData.excerpt, sourceUrl);
  await sendToTwitter(blogData.title, blogData.excerpt, sourceUrl);
}

// ─── Feed Fetching ─────────────────────────────────────────────────────────────
async function fetchFeedXml(url: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/xml, text/xml, */*' },
        timeout: 15000
      });
      return res.data;
    } catch (err: any) {
      console.warn(`[Feed] Attempt ${i + 1} failed for ${url}: ${err.message}`);
      if (i === 2) throw err;
      await delay(2000 * (i + 1));
    }
  }
  throw new Error('Feed fetch failed after all retries');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== UMEAFCN Hub Cron Job Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);

  // 1. Blog generation
  try {
    await handleBlogGeneration();
  } catch (err: any) {
    console.error('[Blog] Error:', err.message);
  }

  // 2. RSS Feed processing
  let processedCount = 0;
  let newPostsCount = 0;
  let apiCallsCount = 0;

  feedLoop: for (const feedUrl of FEEDS) {
    console.log(`\n[Feed] Fetching: ${feedUrl}`);
    let feedXml: string;
    try {
      feedXml = await fetchFeedXml(feedUrl);
    } catch (err: any) {
      console.error(`[Feed] Failed to fetch ${feedUrl}:`, err.message);
      continue;
    }

    const feed = await parser.parseString(feedXml);
    console.log(`[Feed] Found ${feed.items.length} items`);

    for (const entry of feed.items) {
      if (newPostsCount >= MAX_POSTS_PER_RUN || apiCallsCount >= 5) {
        console.log(`[Feed] Reached limit (${newPostsCount} posts, ${apiCallsCount} API calls). Stopping.`);
        break feedLoop;
      }

      processedCount++;
      const guid = entry.guid || entry.id || entry.link || '';
      const title = entry.title || '';
      const guidHash = computeHash(guid, title);

      const existing = await getPostByHash(guidHash);
      if (existing) { console.log(`[Feed] Duplicate, skipping: ${title}`); continue; }

      console.log(`[Feed] New post: ${title}`);
      const rawContent = entry.content || entry.contentSnippet || entry.summary || '';
      const expandedData = await expandArticle(title, rawContent);
      apiCallsCount++;

      const slug = generateSlug(title);
      await insertPost(title, expandedData.content, entry.link || feedUrl, guidHash, slug, expandedData.category, expandedData.apply_type, expandedData.apply_link);

      if (expandedData.apply_type !== 'none' && expandedData.apply_link) {
        newPostsCount++;
        const sourceUrl = `https://www.umeafcnhub.online/post/${slug}`;
        await sendToTelegram(title, expandedData.content, sourceUrl);
        await sendToTwitter(title, expandedData.content, sourceUrl);
      } else {
        console.log(`[Feed] No apply method found, skipping social posts for: ${title}`);
      }

      await delay(2000); // Avoid Gemini burst limits
    }
  }

  console.log(`\n=== Cron Complete: ${processedCount} checked, ${newPostsCount} new posts published ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
