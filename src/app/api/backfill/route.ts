import { NextResponse } from 'next/server';
import { initDb, getPostsWithShortContent, updatePostContent } from '@/lib/db';
import { paraphraseHtml, expandArticle } from '@/lib/gemini';
import { scrapeMyJobMagApplicationMethod } from '@/lib/scraper';

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
        let contentToExpand = post.content;
        try {
          const scrapedMethod = await scrapeMyJobMagApplicationMethod(post.source_url);
          if (scrapedMethod) {
            console.log(`Successfully scraped application method for backfill post ${post.id}`);
            contentToExpand += `\n\nMethod of Application:\n${scrapedMethod}`;
          }
        } catch (scrapeErr: any) {
          console.error(`Failed to scrape application method for backfill post ${post.id}:`, scrapeErr.message || scrapeErr);
        }

        // Expand the short RSS summary into a full article using Gemini
        const expandedData = await expandArticle(post.title, contentToExpand);

        if (expandedData.content && expandedData.content.length > post.content.length) {
          console.log(`Successfully expanded article! (${expandedData.content.length} chars)`);

          // Update the database
          await updatePostContent(
            post.id, 
            expandedData.content, 
            expandedData.category,
            expandedData.apply_type,
            expandedData.apply_link
          );
          updatedCount++;

          console.log(`Successfully backfilled post ID ${post.id}: "${post.title}"`);
        } else {
          console.log(`Could not expand article for: "${post.title}"`);
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
