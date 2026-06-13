import { NextResponse } from 'next/server';
import { initDb, getPostsWithShortContent, updatePostContent } from '@/lib/db';
import { paraphraseHtml } from '@/lib/gemini';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow 5 minutes

export async function GET() {
  try {
    await initDb();

    // Get all posts with short content (under 500 chars = likely only RSS summary)
    const shortPosts = await getPostsWithShortContent(500);

    console.log(`Found ${shortPosts.length} posts with short content to backfill.`);

    let updatedCount = 0;

    for (const post of shortPosts) {
      if (!post.source_url) continue;

      try {
        console.log(`Backfilling: "${post.title}" from ${post.source_url}`);

        const response = await fetch(post.source_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (!response.ok) {
          console.log(`Failed to fetch ${post.source_url}: ${response.status}`);
          continue;
        }

        const htmlString = await response.text();

        // Extract the main article content using Readability
        const dom = new JSDOM(htmlString, { url: post.source_url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (article && article.content && article.content.length > post.content.length) {
          console.log(`Got full article (${article.content.length} chars vs ${post.content.length} chars). Paraphrasing...`);

          // Paraphrase the full article content
          const paraphrasedContent = await paraphraseHtml(article.content);

          // Update the database
          await updatePostContent(post.id, paraphrasedContent || article.content);
          updatedCount++;

          console.log(`Successfully backfilled post ID ${post.id}: "${post.title}"`);
        } else {
          console.log(`Could not extract a longer article body for: "${post.title}"`);
        }
      } catch (err) {
        console.error(`Error backfilling post ID ${post.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      totalShortPosts: shortPosts.length,
      updatedPosts: updatedCount,
      message: `Backfilled ${updatedCount} out of ${shortPosts.length} posts with full content.`,
    });
  } catch (error: any) {
    console.error('Backfill error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
