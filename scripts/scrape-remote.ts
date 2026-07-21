/**
 * Standalone Remote Jobs Scraper for GitHub Actions
 *
 * Pulls remote jobs from two FREE, no-key public APIs:
 *   1. Himalayas  — https://himalayas.app/jobs/api  (high quality, structured)
 *   2. Jobicy     — https://jobicy.com/api/v2/remote-jobs (high volume)
 *
 * Deduplicates across both sources, expands each new job into a full
 * article via Gemini AI, then saves to Neon DB under the "Remote" category
 * and posts to Telegram.
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
import { neon } from '@neondatabase/serverless';
import { GoogleGenAI } from '@google/genai';
import { TwitterApi } from 'twitter-api-v2';

// ─── Database Setup ───────────────────────────────────────────────────────────
const neonSql = neon(process.env.DATABASE_URL!);
const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await neonSql(strings, ...values);
  return { rows: result, rowCount: result.length };
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface RawJob {
  title: string;
  applyUrl: string;
  company: string;
  description?: string; // Optional pre-existing description from API
  source: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeHash(url: string, title: string) {
  return crypto.createHash('sha256').update(`${url}_${title}`).digest('hex');
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
  guidHash: string, slug: string,
  applyType: string, applyLink: string | null
) {
  const result = await sql`
    INSERT INTO posts (title, content, source_url, guid_hash, slug, category, apply_type, apply_link)
    VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug}, 'Remote', ${applyType}, ${applyLink})
    ON CONFLICT (guid_hash) DO NOTHING
    RETURNING id, title, slug;
  `;
  return result.rows[0];
}

// ─── Source 1: Himalayas API ──────────────────────────────────────────────────
async function fetchHimalayas(limit = 20): Promise<RawJob[]> {
  try {
    console.log('[Himalayas] Fetching jobs...');
    const res = await axios.get('https://himalayas.app/jobs/api', {
      params: { limit },
      timeout: 15000,
      headers: { 'Accept': 'application/json', 'User-Agent': 'UMEAFCN-Hub-Scraper/1.0' }
    });

    const jobs = res.data?.jobs || [];
    console.log(`[Himalayas] Got ${jobs.length} jobs`);

    return jobs.map((j: any) => ({
      title: j.title || '',
      applyUrl: j.applicationLink || j.url || '',
      company: j.companyName || 'Unknown Company',
      description: j.description || '',
      source: 'Himalayas'
    })).filter((j: RawJob) => j.title && j.applyUrl);
  } catch (err: any) {
    console.error('[Himalayas] Failed:', err.message);
    return [];
  }
}

// ─── Source 2: Jobicy API ─────────────────────────────────────────────────────
async function fetchJobicy(count = 30): Promise<RawJob[]> {
  try {
    console.log('[Jobicy] Fetching jobs...');
    const res = await axios.get('https://jobicy.com/api/v2/remote-jobs', {
      params: { count },
      timeout: 15000,
      headers: { 'Accept': 'application/json', 'User-Agent': 'UMEAFCN-Hub-Scraper/1.0' }
    });

    const jobs = res.data?.jobs || [];
    console.log(`[Jobicy] Got ${jobs.length} jobs`);

    return jobs.map((j: any) => ({
      title: j.jobTitle || '',
      applyUrl: j.url || '',
      company: j.companyName || 'Unknown Company',
      description: j.jobDescription || '',
      source: 'Jobicy'
    })).filter((j: RawJob) => j.title && j.applyUrl);
  } catch (err: any) {
    console.error('[Jobicy] Failed:', err.message);
    return [];
  }
}

// ─── Gemini AI (expand scraped job into a full article) ───────────────────────
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];

async function expandRemoteJob(job: RawJob): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // If API already gave us a description, use it to write a richer article
  const context = job.description
    ? `Company: ${job.company}\n\nOriginal Job Description:\n${job.description.replace(/<[^>]+>/g, ' ').substring(0, 1200)}`
    : `Company: ${job.company}`;

  const prompt = `Write a detailed, professional, and engaging job post for the following remote job listing.

Title: "${job.title}"
${context}

Instructions:
- Write a compelling intro paragraph about the role
- Include: Overview, Key Responsibilities, Requirements, What You'll Gain
- Mention it is a fully remote, worldwide opportunity
- Format using clean HTML (<h3>, <p>, <ul>, <li>, <strong>). NO <html>/<head>/<body> tags.
- End with: <h3>How to Apply</h3><p>Click the apply button below to view the full job details and submit your application directly through the employer's official page.</p>

Return ONLY valid JSON with one key: "content" (the full HTML string).`;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      let text = (response.text || '{}').replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.content) return parsed.content;
    } catch (error: any) {
      if (error.status === 429) {
        console.warn(`[Gemini] Rate limit on ${modelName}, trying next model...`);
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }
      console.error(`[Gemini] Error with ${modelName}:`, error.message);
    }
  }

  // Fallback: build a basic post from what we know
  return `<h3>About This Role</h3><p>Remote opportunity at <strong>${job.company}</strong>: <strong>${job.title}</strong></p><p>This is a fully remote position open to candidates worldwide.</p><h3>How to Apply</h3><p>Click the apply button below to view the full job details and submit your application directly through the employer's official page.</p>`;
}

// ─── Social Posting ───────────────────────────────────────────────────────────
async function sendToTelegram(title: string, company: string, url: string) {
  try {
    const message = `🌍 *Remote Job: ${title}*\n🏢 ${company}\n\nOpen to candidates worldwide — work from anywhere!\n\n🔗 [View & Apply Here](${url})\n\n📣 More opportunities: @umeafcnhub`;
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

async function sendToTwitter(title: string, company: string, url: string) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
    const shortened = title.length > 80 ? title.substring(0, 80) + '...' : title;
    const tweet = `🌍 Remote Job: ${shortened} @ ${company}\n\n✅ Work from anywhere\n🔗 Apply: ${url}\n\n#RemoteWork #RemoteJobs #WorkFromHome #Jobs #Africa`;
    await client.v2.tweet(tweet);
    console.log(`[Twitter] Sent: ${title}`);
  } catch (err: any) {
    console.error('[Twitter] Error:', err.message);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Remote Jobs Scraper Starting (Himalayas + Jobicy) ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const SITE_URL = 'https://umeafcnhub.online';
  const MAX_JOBS = 6; // 3 from each source per run — stays well within Gemini free tier
  let jobsAdded = 0;

  // ── Fetch from both sources
  const [himalayas, jobicy] = await Promise.all([
    fetchHimalayas(25),
    fetchJobicy(40)
  ]);

  // ── Merge & deduplicate by title (case-insensitive)
  const seen = new Set<string>();
  const allJobs: RawJob[] = [];

  // Interleave: take alternately from each source for variety
  const maxLen = Math.max(himalayas.length, jobicy.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < himalayas.length) allJobs.push(himalayas[i]);
    if (i < jobicy.length) allJobs.push(jobicy[i]);
  }

  const uniqueJobs = allJobs.filter(j => {
    const key = j.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n[Scraper] Total unique jobs to check: ${uniqueJobs.length}`);

  // ── Process each job
  for (const job of uniqueJobs) {
    if (jobsAdded >= MAX_JOBS) {
      console.log(`[Scraper] Reached limit of ${MAX_JOBS} new jobs per run.`);
      break;
    }

    const guidHash = computeHash(job.applyUrl, job.title);
    const existing = await getPostByHash(guidHash);
    if (existing) {
      console.log(`[Scraper] Already exists, skipping: ${job.title}`);
      continue;
    }

    console.log(`\n[Scraper] NEW job from ${job.source}: ${job.title} @ ${job.company}`);

    // Expand into a full article using Gemini
    const content = await expandRemoteJob(job);
    const slug = generateSlug(job.title);
    const postUrl = `${SITE_URL}/post/${slug}`;

    const saved = await insertPost(
      job.title,
      content,
      job.applyUrl,
      guidHash,
      slug,
      'url',
      job.applyUrl
    );

    if (saved) {
      console.log(`[Scraper] ✅ Saved to DB: ${job.title}`);
      await sendToTelegram(job.title, job.company, postUrl);
      await sendToTwitter(job.title, job.company, postUrl);
      jobsAdded++;
    }

    // Delay between Gemini calls to stay within free tier
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log(`\n=== Remote Scraper Complete: ${jobsAdded} new remote jobs added ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
