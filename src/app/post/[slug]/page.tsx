import { getPostBySlug, getPostById } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export const revalidate = 0; // Don't statically generate this page so it's always fresh

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  
  let post = null;
  try {
    post = await getPostBySlug(identifier);
    if (!post && !isNaN(parseInt(identifier, 10))) {
      post = await getPostById(parseInt(identifier, 10));
    }
  } catch (err) {}

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested job post could not be found.',
    };
  }

  // Generate a short description from the HTML content for SEO
  const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...';

  return {
    title: `${post.title} | Jobs With Clinton`,
    description: plainTextContent,
    openGraph: {
      title: post.title,
      description: plainTextContent,
      type: 'article',
      publishedTime: new Date(post.pub_date).toISOString(),
    },
  };
}

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
    <article className="single-post">
      <div className="post-featured-banner">
        <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} fallbackSeed={post.id} />
      </div>
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="category-badge">{post.category || 'General'}</span>
          <time>Published on: {new Date(post.pub_date).toLocaleString()}</time>
        </div>
      </header>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="post-footer">
        {post.apply_type === 'email' && post.apply_link && (
          <a href={`mailto:${post.apply_link}`} className="apply-btn">
            Apply via Email
          </a>
        )}
        {post.apply_type === 'url' && post.apply_link && (
          <a href={post.apply_link} target="_blank" rel="noopener noreferrer" className="apply-btn">
            Apply Now
          </a>
        )}
        {(post.apply_type === 'email' || post.apply_type === 'url') && post.apply_link && (
          <><br/><br/></>
        )}
        <Link href="/" className="btn-back">
          &larr; Back to all posts
        </Link>
      </div>
    </article>
  );
}
