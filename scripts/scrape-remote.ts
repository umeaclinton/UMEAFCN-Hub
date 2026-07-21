/**
 * Standalone Remote Jobs Scraper for GitHub Actions
 * 
 * Scrapes remote jobs from jobfound.org/remote and saves them
 * directly to the Neon database under the "Remote" category.
 * 
 * Run manually:   npx tsx scripts/scrape-remote.ts
 * Triggered by:   .github/workflows/scrape-remote.yml
 */

// Load .env.local for local testing
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import crypto from 'crypto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { neon } from '@neondatabase/serverless';
import { GoogleGenAI } from '@google/genai';
import { TwitterApi } from 'twitter-api-v2';

// ─── Database Setup ───────────────────────────────────────────────────────────
const neonSql = neon(process.env.DATABASE_URL!);
const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await neonSql(strings, ...values);
  return { rows: result, rowCount: result.length };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeHash(guid: string, title: string) {
  return crypto.createHash('sha256').update(`${guid}_${title}`).digest('hex');
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

async function getPostByHash(guidHash: string) {
  const result = await sql`SELECT id FROM posts WHERE guid_hash = ${guidHash} LIMIT 1;`;
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function insertPost(
  title: string, content: string, sourceUrl: string,
  guidHash: string, slug: string, category: string,
  applyType: string, applyLink: string | null
) {
  const result = await sql`
    INSERT INTO posts (title, content, source_url, guid_hash, slug, category, apply_type, apply_link)
    VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug}, ${category}, ${applyType}, ${applyLink})
    ON CONFLICT (guid_hash) DO NOTHING
    RETURNING id, title, slug;
  `;
  return result.rows[0];
}

// ─── Gemini AI (expand scraped job into a full article) ───────────────────────
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];

async function expandRemoteJob(title: string, applyUrl: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Write a detailed, professional job post for a remote job listing with this title: "${title}".
Include typical responsibilities, requirements, and benefits for this type of role.
Format using clean HTML (<h3>, <p>, <ul>, <li>, <strong>). No <html>/<head>/<body> tags.
At the end, include: <h3>How to Apply</h3><p>Click the apply button below to view the full job details and submit your application directly on the employer's website.</p>

Return as JSON with keys: "content" (HTML string) only.`,
        config: { responseMimeType: "application/json" }
      });

      let text = (response.text || '{}').replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(text);
      return parsed.content || `<p>Remote opportunity: <strong>${title}</strong></p><p>Click Apply to view full details.</p>`;
    } catch (error: any) {
      if (error.status === 429) { console.warn(`Rate limit on ${modelName}, trying next...`); continue; }
      console.error(`Gemini error with ${modelName}:`, error.message);
    }
  }
  return `<p>Remote opportunity: <strong>${title}</strong></p><p>Click the apply link below to view full details and apply.</p>`;
}

// ─── Social Posting ───────────────────────────────────────────────────────────
async function sendToTelegram(title: string, url: string) {
  try {
    const message = `🌍 *Remote Job Alert: ${title}*\n\nThis is a fully remote opportunity open to candidates worldwide.\n\n🔗 [View & Apply Here](${url})\n\n📣 More remote jobs: @umeafcnhub`;
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

async function sendToTwitter(title: string, url: string) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
    const shortened = title.length > 100 ? title.substring(0, 100) + '...' : title;
    const tweet = `🌍 Remote Job: ${shortened}\n\n✅ Work from anywhere\n🔗 Apply: ${url}\n\n#RemoteWork #RemoteJobs #WorkFromHome #Jobs`;
    await client.v2.tweet(tweet);
    console.log(`[Twitter] Sent: ${title}`);
  } catch (err: any) {
    console.error('[Twitter] Error:', err.message);
  }
}

// ─── Main Scraper ─────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Remote Jobs Scraper Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const SITE_URL = 'https://umeafcnhub.online';
  const MAX_JOBS = 5; // Limit per run to stay within Gemini free tier
  let jobsAdded = 0;

  // Fetch jobfound.org/remote
  let html: string;
  try {
    const res = await axios.get('https://jobfound.org/remote', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000
    });
    html = res.data;
    console.log(`[Scraper] Page fetched (${html.length} bytes)`);
  } catch (err: any) {
    console.error('[Scraper] Failed to fetch jobfound.org:', err.message);
    process.exit(1);
  }

  const $ = cheerio.load(html);

  // Extract job links — jobfound.org uses Next.js so jobs are in <a> tags
  // We look for links that appear to be individual job listings
  const jobLinks: { title: string; href: string }[] = [];

  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();

    // Filter: must be a job link (has /jobs/ or /remote/ in path), with a reasonable title
    const isJobLink = (href.includes('/jobs/') || href.includes('/job/') || href.match(/\/[a-z0-9-]{10,}\/?$/))
      && !href.includes('login')
      && !href.includes('signup')
      && !href.includes('post-a-job')
      && !href.includes('#')
      && text.length > 8
      && text.length < 200;

    if (isJobLink && text) {
      const fullHref = href.startsWith('http') ? href : `https://jobfound.org${href}`;
      // Deduplicate by href
      if (!jobLinks.find(j => j.href === fullHref)) {
        jobLinks.push({ title: text, href: fullHref });
      }
    }
  });

  console.log(`[Scraper] Found ${jobLinks.length} potential job links`);

  for (const job of jobLinks) {
    if (jobsAdded >= MAX_JOBS) {
      console.log(`[Scraper] Reached limit of ${MAX_JOBS} new jobs per run.`);
      break;
    }

    const guidHash = computeHash(job.href, job.title);
    const existing = await getPostByHash(guidHash);
    if (existing) {
      console.log(`[Scraper] Already exists, skipping: ${job.title}`);
      continue;
    }

    console.log(`[Scraper] New remote job: ${job.title}`);

    // Expand the job title into a full article using Gemini
    const content = await expandRemoteJob(job.title, job.href);
    const slug = generateSlug(job.title);
    const postUrl = `${SITE_URL}/post/${slug}`;

    await insertPost(
      job.title,
      content,
      job.href,
      guidHash,
      slug,
      'Remote',
      'url',
      job.href
    );

    console.log(`[Scraper] Saved to DB: ${job.title}`);

    // Post to Telegram and Twitter
    await sendToTelegram(job.title, postUrl);
    await sendToTwitter(job.title, postUrl);

    jobsAdded++;

    // Small delay to avoid hammering Gemini
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n=== Remote Scraper Complete: ${jobsAdded} new remote jobs added ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
