import { getBlogPosts } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Career Advice Blog | Jobs With Clinton',
  description: 'Read the latest professional career guides, CV optimization tips, graduate trainee hacks, and fully-funded scholarship search strategies.',
};

export default async function BlogIndex() {
  let articles: any[] = [];
  try {
    articles = await getBlogPosts(20, 0);
  } catch (err) {
    console.error("Error loading blog posts:", err);
  }

  return (
    <div>
      <div className="welcome-section">
        <h1>Career Advice Blog</h1>
        <p>Expert guides on resumes, interview preparation, scholarships, and job search strategies.</p>
      </div>

      <div className="posts-grid">
        {articles.length > 0 ? (
          articles.map((art) => (
            <article key={art.id} className="post-card">
              <div className="post-card-image">
                <img src={getCategoryImage('blog', art.title)} alt={art.title} loading="lazy" />
              </div>
              <h2>
                <Link href={`/blog/${art.slug}`}>{art.title}</Link>
              </h2>
              <div className="post-meta">
                <span className="category-badge">Career Guide</span>
                <time>{new Date(art.pub_date).toLocaleDateString()}</time>
                <span>By {art.author}</span>
              </div>
              <div className="post-excerpt">
                {art.excerpt}
              </div>
              <Link href={`/blog/${art.slug}`} className="read-more">
                Read Article &rarr;
              </Link>
            </article>
          ))
        ) : (
          <div className="no-posts">
            <p>No blog posts found yet. Check back soon for fresh career advice!</p>
          </div>
        )}
      </div>
      
      <div className="post-footer" style={{ marginTop: '48px' }}>
        <Link href="/" className="btn-back">
          &larr; Back to Job Board
        </Link>
      </div>
    </div>
  );
}
