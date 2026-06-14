import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function paraphraseText(text: string): Promise<string> {
  if (!text || text.length < 10) return text;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Paraphrase the following text. Do not add conversational filler. Keep the same tone and meaning:\n\n${text}`,
    });
    return response.text || text;
  } catch (error) {
    console.error('Error paraphrasing text:', error);
    return text;
  }
}

export async function expandArticle(title: string, summary: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Write a detailed, comprehensive, and professional blog post expanding on the following job listing summary. 
Format the output using clean HTML (e.g., <p>, <ul>, <li>, <h3>, <strong>). Do not include <html>, <head>, or <body> tags. 
Keep a professional, encouraging tone suitable for a job board. Do not add fake links.

Title: ${title}
Summary: ${summary}`,
    });
    
    // Clean up any markdown code blocks from the response
    let text = response.text || summary;
    if (text.startsWith('```html')) {
      text = text.replace(/^```html\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    return text;
  } catch (error) {
    console.error('Error expanding article:', error);
    return summary;
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
