import { getRecentPosts, getTotalPostsCount, getLatestPostsByCategory } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
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
                  <img src={getCategoryImage(post.category, post.title)} alt={post.title} loading="lazy" />
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

  try {
    internships = await getLatestPostsByCategory('Internships', 4);
    gradPrograms = await getLatestPostsByCategory('Graduate Programs', 4);
    scholarships = await getLatestPostsByCategory('Scholarships', 4);
    recentJobs = await getLatestPostsByCategory('jobs', 8);
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

      {/* Top Banner Community CTA */}
      <div className="community-promo-banner">
        <div className="promo-text">
          <span className="new-tag">Join Community</span>
          <p>Get real-time alerts on your phone. Join our active WhatsApp channel.</p>
        </div>
        <a 
          href="https://whatsapp.com/channel/0029Va9uQXIAYlUP7x3kDQ2T" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="promo-btn"
        >
          Join WhatsApp
        </a>
      </div>

      {/* 1. Graduate Programs Section */}
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
                  <img src={getCategoryImage(post.category, post.title)} alt={post.title} loading="lazy" />
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

      {/* 2. Internships Section */}
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
                  <img src={getCategoryImage(post.category, post.title)} alt={post.title} loading="lazy" />
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
          <a href="https://whatsapp.com/channel/0029Va9uQXIAYlUP7x3kDQ2T" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
            Join WhatsApp Channel
          </a>
          <Link href="/blog" className="cta-btn secondary">
            Read Career Advice
          </Link>
        </div>
      </div>

      {/* 3. Scholarships Section */}
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
                  <img src={getCategoryImage(post.category, post.title)} alt={post.title} loading="lazy" />
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

      {/* 4. Latest Job Openings Section */}
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
                  <img src={getCategoryImage(post.category, post.title)} alt={post.title} loading="lazy" />
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
