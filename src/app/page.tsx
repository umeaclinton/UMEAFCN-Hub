import { getRecentPosts, getTotalPostsCount, getLatestPostsByCategory, getBlogPosts } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';

export const revalidate = 0; // Don't cache this page statically

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const limit = 12; // Posts per page
  const offset = (currentPage - 1) * limit;

  // Search mode active
  if (query) {
    let posts: any[] = [];
    let totalPosts = 0;
    try {
      posts = await getRecentPosts(limit, offset, query);
      totalPosts = await getTotalPostsCount(query);
    } catch (err) {
      console.error("Error loading search posts:", err);
    }
    const totalPages = Math.ceil(totalPosts / limit);

    return (
      <div>
        <div className="search-header-info">
          <h2>Search Results for "{query}"</h2>
          <Link href="/" className="clear-search-btn">&larr; Back to Home</Link>
        </div>

        <form action="/" method="GET" className="search-form">
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Search jobs..." 
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category || 'General'}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read More
                </Link>
              </article>
            ))
          ) : (
            <div className="no-posts">
              <p>No opportunities found matching "{query}".</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-controls">
              <Link 
                href={`/?page=${currentPage - 1}&q=${query}`} 
                className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
              >
                &larr; Previous
              </Link>
              <Link 
                href={`/?page=${currentPage + 1}&q=${query}`} 
                className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
              >
                Next &rarr;
              </Link>
            </div>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Home Showcase Mode
  let internships: any[] = [];
  let gradPrograms: any[] = [];
  let scholarships: any[] = [];
  let recentJobs: any[] = [];
  let blogPosts: any[] = [];

  try {
    internships = await getLatestPostsByCategory('Internships', 4);
    gradPrograms = await getLatestPostsByCategory('Graduate Programs', 4);
    scholarships = await getLatestPostsByCategory('Scholarships', 4);
    recentJobs = await getLatestPostsByCategory('jobs', 8);
    blogPosts = await getBlogPosts(8, 0); // Query 8 posts to display in 2 rows of 4 columns
  } catch (err) {
    console.error("Error loading showcase items:", err);
  }

  return (
    <div className="home-showcase">
      {/* Top Welcome & Search */}
      <div className="welcome-section">
        <h1>Find Your Next Opportunity</h1>
        <p>Browse thousands of curated jobs, internships, scholarships, and graduate programs.</p>
        
        <form action="/" method="GET" className="search-form">
          <input 
            type="text" 
            name="q" 
            placeholder="Search jobs, internships, scholarships..." 
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Founder's Note & Newsletter */}
      <div className="founder-welcome-banner">
        <div className="founder-note">
          <div className="founder-image-wrapper">
            <img src="/ceo&founderimgage.jpg" alt="Michael Udochukwu Odoemenam" className="founder-image" />
          </div>
          <div className="founder-text">
            <h3>Welcome to UMEAFCN Hub!</h3>
            <p>I built this platform to curate the best remote jobs, internships, and scholarships in one place. No spam, just real opportunities hand-picked for our community. <br/><strong>Michael Udochukwu Odoemenam</strong>, Founder & CEO</p>
            <div style={{ marginTop: '0.5rem' }}>
              <a href="https://www.linkedin.com/in/umeaclinton/" target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect with me on LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className="newsletter-capture">
          <h4>Join 10,000+ professionals getting our weekly opportunity digest.</h4>
          <form className="newsletter-form" action="/contact">
            <input type="email" placeholder="Enter your email address" required className="newsletter-input" />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
          <div className="newsletter-footer">
            <Link href="/contact">Or click here to Post a Job to our board &rarr;</Link>
          </div>
        </div>
      </div>

      {/* 1. Career Blog Advice Section (Prioritized at the absolute top) */}
      {blogPosts.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Career Advice & Guides</h2>
            <Link href="/blog" className="see-all-link">Read All Articles &rarr;</Link>
          </div>
          <div className="posts-grid">
            {blogPosts.map((art) => (
              <article key={art.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage('blog', art.title, art.id)} alt={art.title} loading="lazy" fallbackSeed={art.id} />
                </div>
                <h2>
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">Career Guide</span>
                  <time>{new Date(art.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {art.excerpt}
                </div>
                <Link href={`/blog/${art.slug}`} className="read-more">
                  Read Article
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. Graduate Programs Section */}
      {gradPrograms.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Graduate Trainee Programs</h2>
            <Link href="/?q=Graduate" className="see-all-link">See All Graduate Programs &rarr;</Link>
          </div>
          <div className="posts-grid">
            {gradPrograms.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Internships Section */}
      {internships.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Latest Internships</h2>
            <Link href="/?q=Internship" className="see-all-link">See All Internships &rarr;</Link>
          </div>
          <div className="posts-grid">
            {internships.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Big Middle CTA Card */}
      <div className="middle-cta-card">
        <h2>Accelerate Your Career Today</h2>
        <p>Get notified about bootcamps, fully-funded international scholarships, and early graduate opportunities direct from verified sources.</p>
        <div className="cta-actions">
          <a href="https://t.me/umeafcnhub" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
            Join Telegram Channel
          </a>
          <Link href="/blog" className="cta-btn secondary">
            Read Career Advice
          </Link>
        </div>
      </div>

      {/* 4. Scholarships Section */}
      {scholarships.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Scholarships & Bootcamps</h2>
            <Link href="/?q=Scholarship" className="see-all-link">See All Scholarships &rarr;</Link>
          </div>
          <div className="posts-grid">
            {scholarships.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. Latest Job Openings Section */}
      {recentJobs.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Recent Job Openings</h2>
            <Link href="/?q=job" className="see-all-link">Browse All Jobs &rarr;</Link>
          </div>
          <div className="posts-grid">
            {recentJobs.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
