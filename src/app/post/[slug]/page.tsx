import { getPostBySlug, getPostById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Don't statically generate this page so it's always fresh

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params object in Next.js 15
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  
  let post = null;
  try {
    // Try to load by slug first
    post = await getPostBySlug(identifier);
    
    // Fallback for older posts that only have IDs
    if (!post && !isNaN(parseInt(identifier, 10))) {
      post = await getPostById(parseInt(identifier, 10));
    }
  } catch (err) {
    console.error("Error loading post:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="single-post glass">
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time>Published on: {new Date(post.pub_date).toLocaleString()}</time>
          <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="source-link">
            Original Source
          </a>
        </div>
      </header>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="post-footer">
        <Link href="/" className="btn-back">
          &larr; Back to all posts
        </Link>
      </div>
    </article>
  );
}
