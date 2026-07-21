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

      {/* Top Banner Community CTA -> Replaced with Founder's Note & Newsletter */}
      <div className="founder-welcome-banner" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', margin: '2rem 0', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="founder-note" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            C
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Welcome to UMEAFCN Hub!</h3>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '0.9rem' }}>I built this platform to curate the best remote jobs, internships, and scholarships in one place. No spam, just real opportunities hand-picked for our community. <br/>— <strong>Clinton</strong>, Founder</p>
          </div>
        </div>
        
        <div className="newsletter-capture" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>Join 10,000+ professionals getting our weekly opportunity digest.</h4>
          <form style={{ display: 'flex', gap: '0.5rem' }} action="/contact">
            <input type="email" placeholder="Enter your email address" required style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Subscribe</button>
          </form>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <Link href="/contact" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Or click here to Post a Job to our board &rarr;</Link>
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
