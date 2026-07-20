import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { insertPost, getPostByHash, initDb } from '@/lib/db';
import crypto from 'crypto';

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

export async function GET(request: Request) {
  try {
    await initDb();
    
    // Fetch JobFound Remote page
    const res = await axios.get('https://jobfound.org/remote', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });

    const $ = cheerio.load(res.data);
    let jobsAdded = 0;
    
    // Scrape logic to find job links
    const elements = $('a');
    for (let i = 0; i < elements.length; i++) {
      if (jobsAdded >= 10) break; // Limit per run

      const el = elements[i];
      let href = $(el).attr('href');
      const text = $(el).text().trim();

      // Simple heuristic: looks like a job link if it's long and not a nav link
      if (href && href.length > 20 && text.length > 10 && !href.includes('login') && !href.includes('post-a-job')) {
        if (!href.startsWith('http')) {
          href = 'https://jobfound.org' + href;
        }

        const title = text;
        const guidHash = computeHash(href, title);

        const existing = await getPostByHash(guidHash);
        if (existing) continue;

        const slug = generateSlug(title);
        
        // Save to DB under 'Remote' category
        await insertPost(
          title,
          `<p>New remote opportunity: <strong>${title}</strong></p><p>This job was sourced from our remote partners. Please click the apply link to view the full details and requirements on the original listing.</p>`,
          href,
          guidHash,
          slug,
          'Remote',
          'url',
          href
        );

        jobsAdded++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Scraping complete.',
      jobsAdded 
    });

  } catch (error: any) {
    console.error('Scraper error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
