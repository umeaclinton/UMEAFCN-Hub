import axios from 'axios';
import * as cheerio from 'cheerio';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrapes the 'Method of Application' section from a MyJobMag job listing URL.
 * Falls back to null if not a MyJobMag link or if the section is not found.
 */
export async function scrapeMyJobMagApplicationMethod(url: string, retries = 3, delayMs = 2000): Promise<string | null> {
  if (!url || !url.includes('myjobmag.com')) {
    return null;
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Scraper] Attempt ${i + 1} of ${retries} for URL: ${url}`);
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        timeout: 12000
      });
      
      const html = res.data;
      const $ = cheerio.load(html);
      const appMethodHeader = $('#application-method');
      
      if (appMethodHeader.length > 0) {
        let current = appMethodHeader.next();
        let applicationInstructions = "";
        while (current.length > 0) {
          const el = current.get(0);
          if (!el || !('tagName' in el)) {
            break;
          }
          const tagName = (el as any).tagName.toLowerCase();
          // Stop if we hit another header section or page footer
          if (tagName === 'h2' || tagName === 'h3' || tagName === 'footer') {
            break;
          }
          const text = current.text().trim();
          if (text) {
            applicationInstructions += current.text() + "\n";
          }
          current = current.next();
        }
        
        const result = applicationInstructions.trim();
        if (result) {
          console.log(`[Scraper] Successfully scraped application method (${result.length} chars)`);
          return result;
        }
      }
      
      console.log("[Scraper] No #application-method found on page.");
      return null;
    } catch (err: any) {
      console.warn(`[Scraper] Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) {
        return null;
      }
      await delay(delayMs * (i + 1));
    }
  }
  return null;
}
