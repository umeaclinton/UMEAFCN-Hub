import { getBlogPostBySlug } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let post = null;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (err) {}

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} | Career Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let post = null;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (err) {
    console.error("Error loading blog post details:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="single-post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="category-badge">Career Guide</span>
          <time>Published on: {new Date(post.pub_date).toLocaleDateString()}</time>
          <span>By {post.author}</span>
        </div>
      </header>

      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Community Promotion Inside Article */}
      <div className="middle-cta-card" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <h3>Get Instant Alerts</h3>
        <p>Subscribe to our official WhatsApp channel to get notifications about new internships, graduate traineeships, and scholarships immediately.</p>
        <a href="https://whatsapp.com/channel/0029Va9uQXIAYlUP7x3kDQ2T" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
          Join WhatsApp Channel
        </a>
      </div>

      <div className="post-footer">
        <Link href="/blog" className="btn-back">
          &larr; Back to Blog
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="/" className="btn-back" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
          Go to Job Board
        </Link>
      </div>
    </article>
  );
}
