import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function paraphraseText(text: string): Promise<string> {
  if (!text || text.length < 10) return text;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Paraphrase the following text. Do not add conversational filler. Keep the same tone and meaning:\n\n${text}`,
    });
    return response.text || text;
  } catch (error) {
    console.error('Error paraphrasing text:', error);
    return text;
  }
}

export async function expandArticle(title: string, summary: string): Promise<{ category: string; content: string; apply_type: string; apply_link: string | null }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a detailed, comprehensive, and professional blog post expanding on the following job listing summary. 
Format the output using clean HTML (e.g., <p>, <ul>, <li>, <h3>, <strong>). Do not include <html>, <head>, or <body> tags. 
Keep a professional, encouraging tone suitable for a job board. Do not add fake links.

Additionally, analyze the job title and summary and assign a single 1-2 word category to it (e.g., "Tech", "Finance", "Healthcare", "NGO", "Engineering", "Marketing").

You MUST return the output EXACTLY as a valid JSON object with four keys: "category", "content", "apply_type", and "apply_link". 

Application Extraction Rules:
1. If the job summary instructs applicants to send their CV/Resume to an email address, set "apply_type" to "email" and set "apply_link" to the email address.
2. If there is a direct link to an external application portal/website (that is NOT a myjobmag.com or internal login/signup link), set "apply_type" to "url" and set "apply_link" to that URL.
3. If no clear application email or portal link is provided, or if the only method is to "Log in to apply" or "Create an account on MyJobMag", set "apply_type" to "none" and set "apply_link" to null.

Example format:
{
  "category": "Tech",
  "content": "<p>This is the HTML content...</p>",
  "apply_type": "email",
  "apply_link": "hr@company.com"
}

Title: ${title}
Summary: ${summary}`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let text = response.text || '{}';
    
    try {
      const parsed = JSON.parse(text);
      return {
        category: parsed.category || 'General',
        content: parsed.content || summary,
        apply_type: parsed.apply_type || 'none',
        apply_link: parsed.apply_link || null
      };
    } catch (parseError) {
      console.error('Error parsing JSON from Gemini:', parseError, text);
      return { category: 'General', content: summary, apply_type: 'none', apply_link: null };
    }
    
  } catch (error) {
    console.error('Error expanding article:', error);
    return { category: 'General', content: summary, apply_type: 'none', apply_link: null };
  }
}

export async function paraphraseHtml(html: string): Promise<string> {
  if (!html) return '';
  try {
    const $ = cheerio.load(html, null, false);
    
    // Find all text nodes that have decent length to paraphrase
    // We want to avoid touching links, scripts, pre blocks
    const nodesToParaphrase: any[] = [];
    
    $('*').contents().each((i, el) => {
      if (el.type === 'text') {
        const text = $(el).text().trim();
        const parentTag = $(el).parent().get(0)?.tagName?.toLowerCase();
        
        // Skip tags that shouldn't be altered
        if (['script', 'style', 'code', 'pre'].includes(parentTag || '')) return;
        
        if (text.length > 20) {
          nodesToParaphrase.push(el);
        }
      }
    });

    // Paraphrase nodes sequentially to avoid rate limiting
    for (const node of nodesToParaphrase) {
      const originalText = $(node).text();
      const newText = await paraphraseText(originalText);
      $(node).replaceWith(newText);
    }

    return $.html();
  } catch (error) {
    console.error('Error paraphrasing HTML:', error);
    return html; // Fallback to original
  }
}
